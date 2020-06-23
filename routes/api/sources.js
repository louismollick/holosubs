const express = require('express');
const router = express.Router();

// Models
const Vtuber = require('../../models/Vtuber');
const Source = require('../../models/Source');
const Subtitle = require('../../models/Subtitle');

// Youtube Api functions
const YoutubeApi = require('../youtubeapi');

/**
 * @route GET api/sources
 * @description Get all vtubers featured on holoSubs
 * @access Public
 */
router.get('/', async (req, res) => {
	Source.find()
		.sort({ publishDate: -1 })
		.then(items => res.json(items));
});

/**
 * @route GET api/sources/vtuber/:id
 * @description Get all Sources from a specific vtuber on holoSubs
 * @access Public
 */
router.get('/vtuber/:vtuberid', async (req, res) => {
	Source.find({ vtuber: req.params.vtuberid })
		.sort({ publishDate: -1 })
		.then(items => res.json(items));
});

/**
 * @route POST api/sources/:id
 * @description Create new Source
 * @access Public
 */
router.post('/:id', async (req, res) => {
	try {
		const { id } = req.params; // request must include Source id
		const sourceSnippet = await YoutubeApi.getVideoInfo(id); // Get channel information from Youtube API
		if (!sourceSnippet) throw Error('Something went wrong when retrieving Source info from YoutubeApi.');

		// Verify that Source was uploaded by Vtuber
		const vtuber = await Vtuber.findOne({ _id: sourceSnippet.channelId }).exec();
		if (!vtuber) throw Error('That Source was not uploaded by a vtuber featured on HoloSubs.');

		const source = await Source.findOneAndUpdate( // Update or create Source
			{ _id: id }, {
				_id: id,
				vtuber: sourceSnippet.channelId,
				title: sourceSnippet.title,
				publishDate: sourceSnippet.publishedAt,
			}, { upsert: true, new: true }
		);
		if (!source) throw Error('Something went wrong saving the Source');

		res.status(200).json(source);
	} catch (e) {
		res.status(400).json({
			msg: e.message
		});
	}
});

/**
 * @route POST api/sources/vtuber/:id
 * @description Create all Sources from a specific vtuber on holoSubs
 * @access Public
 */
router.post('/vtuber/:vtuberid', async (req, res) => {
	try {
		const vtuber = await Vtuber.findOne({ _id: req.params.vtuberid });
		if (!vtuber) throw Error('That Source was not uploaded by a vtuber featured on HoloSubs.')
		const sourceArray = await YoutubeApi.getAllSourcesInfoForVtuber(req.params.vtuberid);

		for (const playlistItem of sourceArray) {
			const { resourceId, title, publishedAt } = playlistItem.snippet;
			await Source.findOneAndUpdate( // Update or create Source
				{ _id: resourceId.videoId }, {
					_id: resourceId.videoId,
					title: title,
					vtuber: vtuber._id,
					publishDate: publishedAt,
				}, { upsert: true });
		}
		return res.status(200).json({ success: true });
	} catch (e) {
		console.log(e);
		return res.status(400).json({ success: false, msg: e.message });
	}
});

/**
 * @route DELETE api/sources/:id
 * @description Delete a Source
 * @access Public
 */
router.delete('/:id', async (req, res) => {
	try {
		const removed = await Source.findOneAndDelete({ _id: req.params.id });
		if (!removed) throw Error('No Source found');
		// Delete all subtitles corresponding to this source
		for (const subtitle of removed.subtitles) {
			const sub = await Subtitle.findOneAndUpdate({ _id: subtitle }, { $pull: { 'sources': removed._id } }, { new: true });
			if(sub && sub.sources.length < 1) await sub.deleteOne(); // If no more sources, delete
		}
		res.status(200).json({ success: true });
	} catch (e) {
		res.status(400).json({ msg: e.message, success: false });
	}
});

module.exports = router;