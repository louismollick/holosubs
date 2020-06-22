const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VtuberSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    avatarURL: { type: String, required: true }
});

module.exports = Vtuber = mongoose.model('Vtuber', VtuberSchema);