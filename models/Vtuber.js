const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Video = require('./Video');

const VtuberSchema = new Schema({
    id: { type: String, unique : true, required: true},
    name: { type: String, required: true },
    avatarURL: { type: String, required: true },
    videos: [{type: Schema.ObjectId, ref: 'video'}]
});

// Middleware
VtuberSchema.pre('find', function() {
    this.populate('videos');
});

VtuberSchema.pre('deleteOne', { document: true, query: false }, function(){
    try {
        Video.deleteMany({_id: { $in : this.videos }}).exec();
    } catch (err) {
        throw Error("Something went wrong when deleting the videos");
    }
});

module.exports = Vtuber = mongoose.model('vtuber', VtuberSchema);