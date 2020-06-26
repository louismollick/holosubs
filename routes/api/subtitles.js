const express = require('express');
const router = express.Router();

// Models
const Source = require('../../models/Source');
const Subtitle = require('../../models/Subtitle');

// Youtube Api functions
const YoutubeApi = require('../youtubeapi');

/**
 * @route GET api/subtitles
 * @description Get all subtitles featured on holoSubs
 * @access Public
 */
router.get('/', async (req, res) => {
	try {
        const page = parseInt(req.query.page) || 0; //for next page pass 1 here
        const limit = parseInt(req.query.limit) || 24;
        const query = {};

        const doc = await Subtitle
            .find(query)
            .sort({publishDate: -1})
            .skip(page * limit)
            .limit(limit);
        const count = await Subtitle.countDocuments(query);

        return res.json({total: count, page: page, pageSize: doc.length, items: doc});
    } catch (err) {
        return res.json(err);
    }
});

/**
 * @route GET api/subtitles/vtuber/:id
 * @description Get all subtitles from a specific vtuber on holoSubs
 * @access Public
 */
router.get('/vtuber/:vtuberid', async (req, res) => {
	try {
        const page = parseInt(req.query.page) || 0; //for next page pass 1 here
        const limit = parseInt(req.query.limit) || 24;
        const query = { features: req.params.vtuberid };

        const doc = await Subtitle
            .find(query)
            .sort({publishDate: -1})
            .skip(page * limit)
            .limit(limit);
        const count = await Subtitle.countDocuments(query);

        return res.json({total: count, page: page, pageSize: doc.length, items: doc});
    } catch (err) {
        return res.json(err);
    }
});

/**
 * @route POST api/subtitles/:id
 * @description Create new Subtitle manually
 * @access Public
 */
// router.post('/:id', async (req, res) => {
// 	try {
// 		const { id } = req.params; // request must include Source id
// 		const { sourceIds } = req.body;
// 		if (sourceIds == null || !Array.isArray(sourceIds)) throw Error('Please input a valid sourceIds (array of Strings).');
// 		// Get subtitle information
// 		const subSnippet = await YoutubeApi.getVideoInfo(id); // Get channel information from Youtube API
// 		if (!subSnippet) throw Error('Something went wrong when retrieving Subtitle info from YoutubeApi.');
// 		// Verify that all sources are valid
// 		let source = null;
// 		const sourceObjs = [];
// 		for (const sourceid of sourceIds) {
// 			if (typeof sourceid !== "string") throw Error('Sources must be strings.');
// 			source = await Source.findOne({ _id: sourceid }).exec();
// 			if (!source) throw Error(`The source ${sourceid} is not yet featured on Hololive.`);
// 			sourceObjs.push(source);
// 		}
// 		// Update or create subtitle
// 		const subtitle = await Subtitle.findOneAndUpdate( 
// 			{ _id: id }, {
// 				_id: id,
// 				sources: sourceIds,
// 				uploader: { id: subSnippet.channelId, name: subSnippet.channelTitle },
// 				title: subSnippet.title,
// 				publishDate: subSnippet.publishedAt,
// 			}, { upsert: true, new: true });
// 		// Update or save subtitle in source array
// 		for (const sourceObj of sourceObjs) { 
// 			sourceObj.subtitles.addToSet(id);
// 			await sourceObj.save();
// 		}
// 		res.status(200).json(subtitle);
// 	} catch (e) {
// 		console.log(e);
// 		res.status(400).json({ msg: e.message });
// 	}
// });

/**
 * @route POST api/subtitles/source/:id
 * @description Create all subtitles for a specific Source video
 * @access Public
 */
router.post('/source/:sourceid', async (req, res) => {
	try {
		const { sourceid } = req.params;
		const source = await Source.findOne({ _id: sourceid });
		if (!source) throw Error('That Source was not uploaded by a vtuber featured on HoloSubs.')
		
		await searchSubtitlesForSource(source);

		res.status(200).json({ success: true });
	} catch (e) {
		console.log(e);
		res.status(400).json({ success: false, msg: e.message });
	}
});

/**
 * @route POST api/subtitles/daily
 * @description Daily webhook check for new subtitles
 * @access Public
 */
router.post('/daily', async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 50;
		
		const haventSearched =
			await Source.find()
				.exists('lastSubtitleSearch', false)
				.sort({ publishDate: -1 })
		// Limit to 50 because daily quota is 10000 units and each search costs 100 units
				.limit(50); 
		if(haventSearched.length < limit){
			const difference = limit - haventSearched.length;
			const extras = 
				await Source.find()
					.exists('lastSubtitleSearch', true)
					.sort({ publishDate: -1 })
					.limit(difference);
			haventSearched.concat(extras);
		}
		for (const source of haventSearched) await searchSubtitlesForSource(source);
		res.status(200).json({ success: true });
	} catch (e) {
		console.log(e);
		res.status(400).json({ success: false, msg: e.message });
	}
});

/**
 * @route DELETE api/subtitles/:id
 * @description Delete a Source
 * @access Public
 */
router.delete('/:id', async (req, res) => {
	try {
		const removed = await Subtitle.findOneAndDelete({ _id: req.params.id });
		if (!removed) throw Error('No Subtitle found.');
		// Delete subtitle references from sources 
		await Source.updateMany({ features: removed._id }, { $pull: { 'subtitles': removed._id } });
		return res.status(200).json({ success: true });
	} catch (e) {
		return res.status(400).json({ msg: e.message, success: false });
	}
});

/**
 * Check if title uses a majority of english characters
 * @param {string} title 
 */
const titleIsEnglish = (title) => {
    const containsLetters = title.match(/[\x00-\x7F]/g); // match ASCII
    return (containsLetters !== null && (containsLetters.length/title.length) > 0.8);
    // Return true if the ratio of ASCII (english/symbols) to Jap chars is over 80%.
}

/**
 * Search Youtube for subtitled clips of a source
 * @param {Source} source
 */
const searchSubtitlesForSource = async (source) => {
	const clipArray = await YoutubeApi.getAllSubtitlesInfoForSource(source._id);
	// Create Subtitle document for each found english subtitle video
	const subIdList = [];
	for (const clipItem of clipArray) {
		const { title } = clipItem.snippet;
		if(titleIsEnglish(title)){
			const { channelId, channelTitle, publishedAt } = clipItem.snippet;
			await Subtitle.findOneAndUpdate( 
				{ _id: clipItem.id.videoId }, {
					$addToSet : { 'features': source.vtuber },
					_id: clipItem.id.videoId,
					uploader: { id: channelId, name: channelTitle },
					title: title,
					publishDate: publishedAt,
				}, { upsert: true });
			subIdList.push(clipItem.id.videoId); // Save all created video ids to add to source's list
		}
	}
	// Update original source with new subtitles
	source.subtitles.addToSet(...subIdList);
	source.lastSubtitleSearch = Date.now();
	source.save();
}

module.exports = router;