require('dotenv').config();
const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
});

module.exports = {
    getChannelInfo: async (channelId) => {
        const vtuberInfo = await youtube.channels.list({
            "part": [ "id", "snippet" ],
            "id": [ channelId ],
            "maxResults": 1
        });
        return vtuberInfo.data.items[0].snippet;
    },
    getVideoInfo: async (videoId) => {
        const videoInfo = await youtube.videos.list({
            //TODO
        });
        return vtuberInfo.data.items[0].snippet;
    }
}