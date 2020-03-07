const express = require('express')
const router = express.Router()

const earthquake = require('../app.js')

router.
router.get('/earthquake', earthquake.searchEarthQuakes)
router.get('/searchlocation', earthquake.searchlocation)

router.get('*', function(req, res) {
  res.send({
    error: 'Welcome to the backend of Earthquake Finder',
  })
})

module.exports = router

