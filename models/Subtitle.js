const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubtitleSchema = new Schema({
    _id: { type: String, required: true },
    features: [{ type: String, ref: 'Vtuber' }],
    sources: [{ type: String, ref: 'Source' }],
    uploader : { id : {type: String, required: true}, name : { type: String , required: true } },
    publishDate: { type: Date, required: true},
    title: { type: String, required: true }
});

module.exports = Subtitle = mongoose.model('Subtitle', SubtitleSchema);