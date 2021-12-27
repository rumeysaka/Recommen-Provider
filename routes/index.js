const express = require("express")
const Artist = require('../models/artist')
const Track = require("../models/track")
const router = express.Router()

router.get("/", async (req, res) => {
    let tracks
    try{
        tracks = await Track.find().sort({ uploadedAt: "desc"}).limit(10).exec()
    }catch{
        tracks=[]
    }
    res.render("index", {tracks: tracks})
})


// //Recommend Route
// router.get('/recommend', (req, res) => {
//         renderNewPage(res, new Track())
//   });

//   function renderNewPage(res, track, hasError = false) {
//     renderFormPage(res ,track, "new", hasError)
//   }
//   async function renderFormPage(res, track, form, hasError = false) {
//       const artists = Artist.find({})
//       const params = {
//         artists: artists,
//   }
//         res.render("recommend")
// }

// //Create Artist Route
// router.post('/recommend', async (req, res) => {
//     const artist = new Artist({
//         name: req.body.name
//     })
//     try {
//         const newArtist = await artist.save()
//         res.redirect("/")
//     } catch {

//         res.render('/', {
//             artist: artist,
//             errorMessage: 'Error creating artist'
//         })
//     }

// })
router.get("/home", (req,res )=>{
    res.render("home")
});
router.get("/about", (req,res )=>{
    res.render("about")
});
module.exports = router;    