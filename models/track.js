const mongoose = require("mongoose")

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        require: true
    },
    duration: {
        type: Number,
        require: true
    },
    uploadedAt: {
        type: Date,
        require: true,
        default: Date.now
    },
    coverImage:{
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Artist"
    }
})

trackSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })


module.exports = mongoose.model("Track", trackSchema)