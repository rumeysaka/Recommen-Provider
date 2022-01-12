const mongoose = require("mongoose")
const path = require("path")
const coverImageBasePath = "uploads/trackCovers"

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    genre: {
        type: String
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
    coverImageName:{
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Artist"
    }
})

trackSchema.virtual("coverImagePath").get(function(){
    if(this.coverImageName!= null){
        return path.join("/", coverImageBasePath, this.coverImageName)
    }
})



module.exports = mongoose.model("Track", trackSchema)
module.exports.coverImageBasePath = coverImageBasePath 