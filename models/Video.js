const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Subtitle = require('./Subtitle');

const VideoSchema = new Schema({
    vtuber: {type: Schema.ObjectId, ref: 'vtuber', required: true},
    id: { type: String, unique : true, required: true},
    title: { type: String, required: true },
    publishTime: { type: String, required: true},
    thumbnail: { type: String, required: true },
    subtitles: [{type: Schema.ObjectId, ref: 'subtitle'}]
});

// Middleware
VideoSchema.pre('find', function() {
    this.populate('subtitles');
});
VideoSchema.pre('remove', function(next){
    try {
        Subtitle.remove({_id: { $in : this.subtitles }}).exec();
    } catch (err) {
        throw Error("Something went wrong when deleting the subtitles");
    }
    next();
});

module.exports = Video = mongoose.model('video', VideoSchema);