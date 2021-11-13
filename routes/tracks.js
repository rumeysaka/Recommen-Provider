const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Track = require('../models/track')
const Artist = require('../models/artist')
const uploadPath = path.join('public', Track.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

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
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const track = new Track({
    title: req.body.title,
    artist: req.body.artist,
    releaseDate: new Date(req.body.releaseDate),
    duration: req.body.duraiton,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newTrack = await track.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect("tracks")
  } catch {
    if (track.coverImageName != null) {
      removeTrackCover(track.coverImageName)
    }
    renderNewPage(res, track, true)
  }
})

function removeTrackCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

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

module.exports = router