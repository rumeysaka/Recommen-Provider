const express = require('express')
const router = express.Router()
const Track = require('../models/track')
const Artist = require('../models/artist')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


// All Tracks Route
router.get('/', async (req, res) => {
  // let query = Track.find()
  // if (req.query.title != null && req.query.title != '') {
  //   query = query.regex('title', new RegExp(req.query.title, 'i'))
  // }
  
  let query = Track.find()
  if(req.query.title != null && req.query.title !=""){
    query = query.regex("title", new RegExp(req.query.title,"i"))
  }
  if (req.query.releasedBefore != null && req.query.releasedBefore != '') {
    query = query.lte('releaseDate', req.query.releasedBefore)
  }
  if (req.query.releasedAfter != null && req.query.releasedAfter != '') {
  query = query.gte('releaseDate', req.query.releasedAfter)
  }
  try {
    const tracks = await query.exec()
    res.render('tracks/index', {
      tracks: tracks,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Track Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Track())
})

// Create Track Route
router.post('/', async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const track = new Track({
    title: req.body.title,
    artist: req.body.artist,
    releaseDate: new Date(req.body.releaseDate),
    duration: req.body.duraiton,
    description: req.body.description
  })

  saveCover(track, req.body.cover)

  try {
    const newTrack = await track.save()
    res.redirect("tracks")
  } catch {
    renderNewPage(res, track, true)
    }
})

async function renderNewPage(res, track, hasError = false) {
  try {
    const artists = await Artist.find({})
    const params = {
      artists: artists,
      track: track
    }
    if (hasError) params.errorMessage = 'Error Creating Track'
    res.render('tracks/new', params)
  } catch {
    res.redirect('/tracks')
  }
}

function saveCover(track, coverEncoded) {
  if(coverEncoded== null) return
  const cover = JSON.parse(coverEncoded)
  if(cover != null && imageMimeTypes.includes(cover.type)){
    track.coverImage = new Buffer.from(cover.data, "base64")
    track.coverImageType = cover.type
  }
}

module.exports = router