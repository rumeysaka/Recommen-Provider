const express = require('express')
const router = express.Router()
const Artist = require('../models/artist')
const Track = require("../models/track")

//All Artşst Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
     }
    try {
        const artists = await Artist.find(searchOptions)
        res.render('artists/index', {
          artists: artists,
          searchOptions: req.query
               })
    } catch {
        res.redirect('/')
    }
})


//New Arstist Route
router.get('/new', (req, res) => {
    res.render('artists/new', {
        artist: new Artist()
    })
})

//Create Artist Route
router.post('/', async (req, res) => {
    const artist = new Artist({
        name: req.body.name
    })
    try {
        const newArtist = await artist.save()
        res.redirect(`/artists/${artist.id}`)
    } catch {

        res.render('artists/new', {
            artist: artist,
            errorMessage: 'Error creating artist'
        })
    }

})
router.get('/:id', async (req, res) => {
    try {
      const artist = await Artist.findById(req.params.id)
      const tracks = await Track.find({ artist: artist.id }).limit(6).exec()
      res.render('artists/show', {
        artist: artist,
        tracksByArtist: tracks
      })
    } catch {
      res.redirect('/')
    }
  })

router.get('/:id/edit', async (req, res) => {

    try{
        const artist = await Artist.findById(req.params.id)
        res.render('artists/edit', { artist: artist })
        } catch{
        res.redirect("/artists")
        }
    })

router.put('/:id', async (req, res) => {        
    let artist   
    try {
        artist = await Artist.findById(req.params.id)
        artist.name = req.body.name
        await artist.save()
        res.redirect(`/artists/${artist.id}`)
    } catch {
        if(artist == null){
            res.redirect("/")
        }else{
        res.render('artists/new', {
        artist: artist,
        errorMessage: 'Error updating artist'
        })
    }
}
})

    router.delete('/:id', async (req, res) => {
        let artist
        try {
        artist = await Artist.findById(req.params.id)
        await artist.remove()
        res.redirect('/artists')
        } catch {
        if (artist == null) {
            res.redirect('/')
        } else {
            res.redirect(`/artists/${artist.id}`)
        }
        }
    })
  module.exports = router