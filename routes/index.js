const express = require("express")
const router = express.Router()
const Track = require("../models/track")

router.get("/", async (req, res) => {
    let tracks
    try{
        tracks = await Track.find().sort({ uploadedAt: "desc"}).limit(10).exec()
    }catch{
        tracks=[]
    }
    res.render("index", {tracks: tracks})
})

module.exports = router