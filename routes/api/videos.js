const express = require('express');
const router = express.Router();

// Models
const Vtuber = require('../../models/Vtuber');
const Video = require('../../models/Video');

// Youtube Api functions
const YoutubeApi = require('../youtubeapi');

/**
 * @route GET api/videos
 * @description Get all vtubers featured on holoSubs
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
router.get('/vtuber/:vtuberid', async (req, res) => {
  Video.find({ vtuberid: req.params.vtuberid })
    .then(items => res.json(items));
});

/**
 * @route POST api/videos/vtuber/:id
 * @description Get all videos from a specific vtuber on holoSubs
 * @access Public
 */
router.post('/vtuber/:vtuberid', async (req, res) => {
  try {
    const videoArray = await YoutubeApi.getAllVideosForVtuber(req.params.vtuberid);
    const vtuber = await Vtuber.findOne({ id: req.params.vtuberid }).exec();
    if(!vtuber) throw Error('That video was not uploaded by a vtuber featured on HoloSubs.')

    for (const playlistItem of videoArray) {
      const { resourceId, title, publishedAt, thumbnails } = playlistItem.snippet;

      const video = await Video.findOneAndUpdate( // Update or create video
        { id : resourceId.videoId }, 
        {
          title,
          id: resourceId.videoId,
          vtuberid: req.params.vtuberid,
          publishTime: publishedAt,
          thumbnail: thumbnails.default.url,
          subtitles: []
        },
        { upsert: true, new: true }
      );
      if (!video) throw Error('Something went wrong saving the video');

      vtuber.videos.addToSet(video);

      const newVtuber = await vtuber.save();
      if(!newVtuber) throw Error('Something went wrong saving the video to the vtuber object');
    }
    res.status(200).json({
      success: true
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, msg: e.message });
  }
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
      if (!videoSnippet) throw Error('Something went wrong when retrieving video info from YoutubeApi.');
      
      // Verify that video was uploaded by Vtuber
      const vtuber = await Vtuber.findOne({ id: videoSnippet.channelId }).exec();
      if(!vtuber) throw Error('That video was not uploaded by a vtuber featured on HoloSubs.');
      
      const video = await Video.findOneAndUpdate( // Update or create video
        { id }, {
          id,
          vtuberid: vtuber.id,
          title: videoSnippet.title,
          publishTime: videoSnippet.publishedAt,
          thumbnail: videoSnippet.thumbnails.default.url,
          subtitles: []
        },
        { upsert: true, new: true }
      );
      if (!video) throw Error('Something went wrong saving the video');
      
      vtuber.videos.addToSet(video);

      const newVtuber = await vtuber.save();
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
    const video = await Video.findOne({ id: req.params.id });
    if (!video) throw Error('No video found');
    
    const removed = await video.deleteOne();
    if (!removed) throw Error('Something went wrong while trying to delete that video');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;