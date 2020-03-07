//In order to connect back and front end's this would have been the routes of access to the backend

const express = require('express')
const router = express.Router()

const earthquake = require('./app.js')

//To look for the closest earthquakes
router.post('/searchearthquake', earthquake.searchEarthQuakes)
//To get the lon and lat of the place
router.post('/searchlocation', earthquake.searchlocation)
//The parameters of request and return that every rout must follow
router.get('*', function(req, res) {
  res.send({
    error: 'Welcome to the backend of Earthquake Finder',
  })
})

//Exporting the router for outer usage
module.exports = router

