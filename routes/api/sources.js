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
    try {
        const page = parseInt(req.query.page) || 0; //for next page pass 1 here
        const limit = parseInt(req.query.limit) || 24;
        const query = (typeof req.query.vtuberid === "string" && req.query.vtuberid.length > 1) 
            ? { vtuber: req.query.vtuberid } : {};
        const doc = await Source
            .find(query)
            .sort({ publishDate: -1 })
            .skip(page * limit)
            .limit(limit)
            .populate('vtuber');
        const count = await Source.countDocuments(query);

        return res.json({ total: count, page: page, pageSize: doc.length, items: doc });
    } catch (err) {
        return res.json(err);
    }
});

/**
 * @route GET api/sources/:id
 * @description Get specific information about Source
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        if (!req.params.id) throw new Error("Please input an id.");
        const source = await Source
            .find({ _id: req.params.id })
            .sort({ publishDate: -1 })
            .populate('subtitles');
        return res.json(source);
    } catch (err) {
        return res.json(err);
    }
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
        if (!sourceSnippet)
            throw Error('Something went wrong when retrieving Source info from YoutubeApi.');

        // Verify that Source was uploaded by Vtuber
        const vtuber = await Vtuber
            .findOne({ _id: sourceSnippet.channelId });
        if (!vtuber)
            throw Error('That Source was not uploaded by a vtuber featured on HoloSubs.');

        const source = await Source.findOneAndUpdate({ // Update or create Source
            _id: id
        }, {
            _id: id,
            vtuber: sourceSnippet.channelId,
            title: sourceSnippet.title,
            publishDate: sourceSnippet.publishedAt
        }, {
            upsert: true,
            new: true
        });
        if (!source)
            throw Error('Something went wrong saving the Source');

        res
            .status(200)
            .json(source);
    } catch (e) {
        res
            .status(400)
            .json({ msg: e.message });
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
        for (constplaylistItem of sourceArray) {
            const { resourceId, title, publishedAt } = playlistItem.snippet;
            await Source.findOneAndUpdate({ // Update or create Source
                _id: resourceId.videoId
            }, {
                _id: resourceId.videoId,
                title: title,
                vtuber: vtuber._id,
                publishDate: publishedAt
            }, { upsert: true });
        }
        return res
            .status(200)
            .json({ success: true });
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ success: false, msg: e.message });
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
        if (!removed) throwError('No Source found');

        // Delete all subtitles corresponding to this source
        for (const subtitle of removed.subtitles) {
            const sub = await Subtitle.findOneAndUpdate({
                _id: subtitle
            }, {
                $pull: {
                    'sources': removed._id
                }
            }, { new: true });
            if (sub && sub.sources.length < 1)
                await sub.deleteOne(); // If no more sources, delete
        }
        res
            .status(200)
            .json({ success: true });
    } catch (e) {
        res
            .status(400)
            .json({ msg: e.message, success: false });
    }
});

module.exports = router;