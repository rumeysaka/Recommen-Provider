const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Track = require('../models/track')
const Artist = require('../models/artist')
<<<<<<< HEAD
const { redirect } = require('express/lib/response')
=======
const uploadPath = path.join('public', Track.coverImageBasePath)
>>>>>>> parent of 9bae50f (file upload renewed)
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
  if(req.query.genre != null && req.query.genre !=""){
    query = query.regex("genre", new RegExp(req.query.genre,"i"))
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
<<<<<<< HEAD
    genre: req.body.genre
=======
    coverImageName: fileName,
    description: req.body.description
>>>>>>> parent of 9bae50f (file upload renewed)
  })

  try {
    const newTrack = await track.save()
<<<<<<< HEAD
    res.redirect(`tracks/${newTrack.id}`)
=======
    // res.redirect(`books/${newBook.id}`)
    res.redirect("tracks")
>>>>>>> parent of 9bae50f (file upload renewed)
  } catch {
    if (track.coverImageName != null) {
      removeTrackCover(track.coverImageName)
    }
    renderNewPage(res, track, true)
  }
})
// show track route
router.get("/:id", async (req,res) =>{
  try{
    const track = await Track.findById(req.params.id)
                            .populate("artist")
                            .exec()
    res.render("tracks/show", {track: track})
  } catch{
    res.redirect("/")
  }
})

// Edit Track Route
router.get('/:id/edit', async (req, res) => {
  try{
    const track =await Track.findById(req.params.id)
    renderEditPage(res, track)
  } catch{
    res.redirect("/")
  }
})
// Update Track Route
router.put('/:id', async (req, res) => {
  let track
  try {
    track = await Track.findById(req.params.id)
    track.title = req.body.title
    track.artist = req.body.artist
    track.releaseDate = new Date(req.body.releaseDate)
    track.duration = req.body.duration
    track.genre = req.body.genre
    if(req.body.cover != null && req.body.cover !==""){
      saveCover(track, req.body.cover)
    }
    await track.save()
    res.redirect(`/tracks/${track.id}`)
  } catch {
    if (track != null) {
      renderEditPage(res, track, true)
    } else {
      redirect('/')
    }
    }
})
// Delete Track Page
router.delete('/:id', async (req, res) => {
  let track
  try {
    track = await Track.findById(req.params.id)
    await track.remove()
    res.redirect('/tracks')
  } catch {
    if (track != null) {
      res.render('tracks/show', {
        track: track,
        errorMessage: 'Could not remove track'
      })
    } else {
      res.redirect('/')
    }
  }
})

function removeTrackCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, track, hasError = false) {
  renderFormPage(res ,track, "new", hasError)
}

async function renderEditPage(res, track, hasError = false) {
  renderFormPage(res ,track, "edit", hasError)
}

async function renderFormPage(res, track, form, hasError = false) {
  try {
    const artists = await Artist.find({})
    const params = {
      artists: artists,
      track: track
    }
    if(hasError){
      if(form === "edit"){
        params.errorMessage="Error Updating the Track"
      } else{
        params.errorMessage="Error Creating the Track"
      }
    }
    if (hasError) params.errorMessage = 'Error Creating Track'
    res.render(`tracks/${form}`, params)
  } catch {
    res.redirect('/tracks')
  }
}

module.exports = router