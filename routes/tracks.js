const express = require('express')
const router = express.Router()
const Track = require('../models/track')
const Artist = require('../models/artist')
const { redirect } = require('express/lib/response')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const mongoose = require("mongoose")
const db = mongoose.connection
const querystring = require('querystring');

// All Tracks Route
router.get('/', async (req, res) => {

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

router.get('/recommend', async (req, res) => {

  let query = Track.find()
  if(req.query.title != null && req.query.title !=""){
    query = query.regex("title", new RegExp(req.query.title,"i"))
  }

  let query2 = Track.find()

  try {
    let tracks = await query.exec()
    one(tracks)
    
    query2=parseData.genre
    let cursor = await query2.exec()

    // cursor = await Track.find({genre: `&{rec}`})  
    res.render('tracks/recommend', {
      tracks: tracks,
      rec:rec,
      cursor:cursor,
      searchOptions: req.query
    })
  } catch {
  console.log("error")
    res.redirect('/')
    
  }
})
// router.get("/recommend" ,async (req,res)=>{

//   let query = await Track.find()
//   if(req.query.title != null && req.query.title !=""){
//     query = query.regex("title", new RegExp(req.query.title,"i"))
//     }
  
//   try {
//     const tracks = await query.exec()
//     res.render('tracks/recommend', {
//     tracks: tracks,
//     searchOptions: req.body
//     })
//   } 
//   catch {
//     console.log("error")
//     res.redirect('/')
//   }
// })

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
    genre: req.body.genre
  })

  saveCover(track, req.body.cover)

  try {
    const newTrack = await track.save()
    res.redirect(`tracks/${newTrack.id}`)
  } catch {
    renderNewPage(res, track, true)
    }
})
// show track route
router.get("/:id", async (req,res) =>{
  try{
    const track = await Track.findById(req.params.id).populate("artist").exec()
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


function one(tracks){
  let parseData = JSON.parse(tracks)
  rec = parseData.genre
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