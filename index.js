require('dotenv').config();

const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
});

const updateVideoListing = async (channelId) => {
    console.log("---------------------");
    const videos = await youtube.playlistItems.list({
        "part": [ "id", "snippet" ],
        "playlistId": channelId // "uploads" playlist's id is the channel's id
    });
    console.log(videos);
}
/*
{
  "kind": "youtube#channelListResponse",
  "etag": "uqsMIr4r6ZHHNJ-yuJJQjXYJ86w",
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 1
  },
  "items": [
    {
      "kind": "youtube#channel",
      "etag": "xxHURW639ViQ9ksYKE8Ps8m-PfM",
      "id": "UCZlDXzGoo7d44bwdNObFacg",
      "snippet": {
        "title": "Kanata Ch. 天音かなた",
        "description": "へい！ホロライブ4期生、天音かなたです。PP天使\n毎日18～20時頃に配信しています。よろしくお願いします！💫\nTwitter→https://twitter.com/amanekanatach\n\nHey! This is Kanata Amane, from Hololive 4th generation. PP angel is me!\nStream every night!\nI'm clumsy but I'll do my best!!!!(*'ω'*)\n\n\nホロライブ所属。\n天界学園に通う天使。人を癒すための研究をしている。\n恥ずかしがりやな性格を隠すために、クールを装おうとする。\n\nお問い合わせ\nカバー株式会社：http://cover-corp.com/ \n公式Twitter:https://twitter.com/hololivetv",
        "publishedAt": "2019-12-04T09:13:34Z",
        "thumbnails": {
          "default": {
            "url": "https://yt3.ggpht.com/a/AATXAJxrwwsyQAAYVrQJbsy6po7XlNIZQElR8RVK-g=s88-c-k-c0xffffffff-no-rj-mo",
            "width": 88,
            "height": 88
          },
          "medium": {
            "url": "https://yt3.ggpht.com/a/AATXAJxrwwsyQAAYVrQJbsy6po7XlNIZQElR8RVK-g=s240-c-k-c0xffffffff-no-rj-mo",
            "width": 240,
            "height": 240
          },
          "high": {
            "url": "https://yt3.ggpht.com/a/AATXAJxrwwsyQAAYVrQJbsy6po7XlNIZQElR8RVK-g=s800-c-k-c0xffffffff-no-rj-mo",
            "width": 800,
            "height": 800
          }
        },
        "defaultLanguage": "ja",
        "localized": {
          "title": "Kanata Ch. Kanata Amane",
          "description": "Hey! This is Kanata Amane, from Hololive 4th generation. PP angel is me!\nStream every night!\nI'm clumsy but I'll do my best!!!!(*'ω'*)\nTwitter→https://twitter.com/amanekanatach"
        },
        "country": "JP"
      }
    }
  ]
}
*/
const addChannelToDatabase = async (channelId) => {
    const vtuber = await youtube.channels.list({
        "part": [
          "snippet",
          "id"
        ],
        "id": [ channelId ],
        "maxResults": 1
    });

    if(vtuber !== null && vtuber.pageinfo.totalResults == 1){
        const { snippet } = vtuber.items[0];

    } else throw new Error("Something went wrong with the Channel Query.");
}

const updateSubtitleListing = async (videoId) => {
    console.log("-----------////----------");
    const clips = await youtube.search.list({
        part: 'id,snippet',
        maxResults: 50,
        safeSearch: 'none',
        q: `https://www.youtube.com/watch?v=${videoId}`
    });
    if(clips.data.items != null){
        for (const clip of clips.data.items) {
            console.log("CLIP", clip);
            const { title } = clip.snippet;
            console.log("ENGLISH?", titleIsEnglish(title));
            console.log("------");
        }
    }
}

const titleIsEnglish = (title) => {
    const containsJap = title.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g);
    return (containsJap == null || (containsJap.length/title.length) < 0.4);
    // Return true if the number of Japanese characters in the title is under 40%.
}

updateSubtitleListing('UZ7EavezZ4A');