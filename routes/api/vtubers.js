const express = require('express');
const router = express.Router();

// Models
const Vtuber = require('../../models/Vtuber');

// Youtube Api functions
const YoutubeApi = require('../youtubeapi');

/**
 * @route GET api/vtubers
 * @description Get all vtubers featured on holoSubs
 * @access Public
 */
router.get('/', async (req, res) => {
    Vtuber.find()
      .then(items => res.json(items));
});

/**
 * @route POST api/vtubers/:id
 * @description Create new Vtuber
 * @access Public
 */
router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params; // request must include channel id
        const vtuberSnippet = await YoutubeApi.getChannelInfo(id); // Get channel information from Youtube API
        if (!vtuberSnippet) throw Error('Something went wrong when retrieving vtuber info from YoutubeApi');
        
        const newVtuber = new Vtuber({
            id,
            name : vtuberSnippet.title,
            avatarURL: vtuberSnippet.thumbnails.default.url,
            videos: []
        });

        const vtuber = await newVtuber.save();
        if (!vtuber) throw Error('Something went wrong saving the vtuber');
  
        res.status(200).json(vtuber);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

/**
 * @route DELETE api/vtubers/:id
 * @description Delete a vtuber
 * @access Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const vtuber = await Vtuber.findById(req.params.id);
    if (!vtuber) throw Error('No vtuber found');
    
    const removed = await list.remove();
    if (!removed)
      throw Error('Something went wrong while trying to delete that vtuber');

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});


module.exports = router;