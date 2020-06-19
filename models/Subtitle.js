const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubtitleSchema = new Schema({
    id: { type: String, unique : true, required: true},
    uploaderId: { type: String, required: true},
    uploaderName: { type: String, required: true},
    publishTime: { type: Date, required: true},
    title: { type: String, required: true },
    thumbnail: { type: String, required: true }
});

module.exports = Subtitle = mongoose.model('subtitle', SubtitleSchema);