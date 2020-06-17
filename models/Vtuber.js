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
VtuberSchema.pre('remove', function(next){
    try {
        Video.remove({_id: { $in : this.videos }}).exec();
    } catch (err) {
        throw Error("Something went wrong when deleting the videos");
    }
    next();
});

module.exports = Vtuber = mongoose.model('vtuber', VtuberSchema);