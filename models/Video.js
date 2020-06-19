const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Subtitle = require('./Subtitle');

const VideoSchema = new Schema({
    id: { type: String, unique : true, required: true},
    vtuberid: { type: String, required: true},
    title: { type: String, required: true },
    publishTime: { type: Date, required: true},
    thumbnail: { type: String, required: true },
    subtitles: [{type: Schema.ObjectId, ref: 'subtitle'}]
});

// Middleware
VideoSchema.pre('find', function() {
    this.populate('subtitles');
});
VideoSchema.pre('deleteOne', { document: true, query: false }, function(){
    try {
        Subtitle.deleteMany({_id: { $in : this.subtitles }}).exec();
    } catch (err) {
        console.log(err);
    }
});

// TODO: Delete all subtitles for a given Vtuber when deleteMany is called
// VideoSchema.pre('deleteMany', function(){
//     try {
//         const id = this.getFilter()["_id"];
//         if (typeof projectId === "undefined") throw Error("Query id is undefined");
//         Subtitle.deleteMany({_id: { $in : this.subtitles }}).exec();
//     } catch (err) {
//         console.log(err);
//         //throw Error("Something went wrong when deleting the subtitles");
//     }
// });

module.exports = Video = mongoose.model('video', VideoSchema);