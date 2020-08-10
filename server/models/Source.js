// https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SourceSchema = new Schema({
    _id: { type: String, required: true },
    vtuber: { type: String, ref: 'Vtuber', required: true },
    subtitles : [{ type: String, ref: 'Subtitle'}],
    title: { type: String, required: true },
    publishDate: { type: Date, required: true },
    lastSubtitleSearch : { type: Date, required: false }
});

module.exports = Source = mongoose.model('Source', SourceSchema);