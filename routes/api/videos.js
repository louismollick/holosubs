const express = require('express');
const router = express.Router();

// Models
const Vtuber = require('../../models/Vtuber');
const Video = require('../../models/Video');

// Youtube Api functions
const YoutubeApi = require('../youtubeapi');

/**
 * @route GET api/videos
 * @description Get all videos featured on holoSubs
 * @access Public
 */
router.get('/', async (req, res) => {
    Video.find()
      .then(items => res.json(items));
});

/**
 * @route GET api/videos/vtuber/:id
 * @description Get all videos from a specific vtuber on holoSubs
 * @access Public
 */
router.get('/vtuber/:vtuberId', async (req, res) => {
    Video
    // TODO find with vtuberId
    .find()
      .then(items => res.json(items));
});

/**
 * @route POST api/videos/:id
 * @description Create new Video
 * @access Public
 */
router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params; // request must include video id
        const videoSnippet = await YoutubeApi.getVideoInfo(id); // Get channel information from Youtube API
        if (!videoSnippet) throw Error('Something went wrong when retrieving video info from YoutubeApi');
        
        // Verify that video was uploaded by Vtuber
        const oldVtuber = await Vtuber.findOne({ id:videoSnippet.channelId });
        //TODO

        const newVideo = new Video({
            id,
            title: videoSnippet.title,
            publishTime: videoSnippet.publishTime,
            thumbnail: videoSnippet.thumbnails.default.url,
            subtitles: [],
        });

        const video = await newVideo.save();
        if (!video) throw Error('Something went wrong saving the video');
        
        vtuber.videos.push(video);

        const newVtuber = await oldVtuber.save();
        if(!newVtuber) throw Error('Something went wrong saving the video to the vtuber object');

        res.status(200).json(video);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

/**
 * @route DELETE api/videos/:id
 * @description Delete a video
 * @access Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) throw Error('No video found');
    
    const removed = await list.remove();
    if (!removed)
      throw Error('Something went wrong while trying to delete that video');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});


module.exports = router;