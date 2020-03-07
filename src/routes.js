const express = require('express')
const router = express.Router()

const earthquake = require('./app.js')

router.post('/earthquake', earthquake.searchEarthQuakes)
router.post('/searchlocation', earthquake.searchlocation)

router.get('*', function(req, res) {
  res.send({
    error: 'Welcome to the backend of Earthquake Finder',
  })
})

module.exports = router

