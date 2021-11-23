const mongoose = require("mongoose")
const Track = require("./track")
const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})

artistSchema.pre('remove', function(next) {
    Track.find({ artist: this.id }, (err, track) => {
      if (err) {
        next(err)
      } else if (track.length > 0) {
        next(new Error('This still'))
      } else {
        next()
      }
    })
  })
module.exports= mongoose.model("Artist", artistSchema)