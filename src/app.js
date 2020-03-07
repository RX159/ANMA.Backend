const request = require('request')
const express = require('express')
const router = require('./routes.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // parsea a json
app.use(router)

//The array of the markers
var markers = new Array

//I used the term geocode for everyfuntcion
const geocode = function(ciudad,callback)
{
	//This firts-function brings back the code of the country of the city/place searched for
	const url = "http://api.geonames.org/search?name_equals="+ciudad+"&maxRows=10&username=RX159"

	//The request is formed
	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			//The error for when there is no internet
			console.log('Error, checar internet')
		}
		else
		{
			
			if(response.body == undefined)
			{
				//The error for when a request arrives corrupted
				console.log('Error, No llego bien el request')
			}
			else
			{
				//Verify that the place we searched for is at the top of the list
				if(ciudad == response.body.geonames[0].toponymName)
				{
					//Sumarize the response body into a single variable
					const data = response.body.geonames[0]
					//get the country code
					const Code = data.countryCode
					//first callback
					callback(Code,ciudad)

				}
				else
				{
					//If the place could not be found
					console.log("Error, Ciudad/Lugar mal escrita /o no especificado")

				}
				
			}
			

			
		}
		
	})

}

const geocode2 = function (Code,Ciudad,callback)
{
	//Next url is to get the bounding box of the whole country where we are searching
	const url = 'http://api.geonames.org/countryInfo?country='+Code+'&username=RX159'

	//All comments of errors and such are the same as the ones in geocode
	request({url, json: true}, function(error, response) 
	{ 
		
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			if(response.body == undefined)
			{
				console.log('Error, se mando mal el request ')
			}
			else
			{
				//we save the coordiantes of the bounding box of the country
				const North = response.body.geonames[0].north
				const South = response.body.geonames[0].south
				const East = response.body.geonames[0].east
				const West = response.body.geonames[0].west

				//second callback
				callback(North,South,East,West,Ciudad)
			}
		}
		
		
	})
}

const geocode3 = function(North, South, East, West, ciudad, callback)
{

	//We search for the nearby earthquakes, using the boundin box of the whole country.
	const url = 'http://api.geonames.org/earthquakesJSON?north='+North+'0&south='+South+'&east='+East+'&west='+West+'&date=2019-03-06&username=rx159'

	//all erros are the same as geocode
	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				//We have to save the top 10 results by date, so a for is used to store them
				for (var i = 0; i<response.body.earthquakes.length ; i++)
				{
					markers[i] = response.body.earthquakes[i]
				}
				//Last callback
				callback(markers)	
			}
		}
	})
}


const geocode4 = function(ciudad,callback)
{
	//This is a url used to get the specific Lat and Lon of the plasce, in order to center the map
	const url = "http://api.geonames.org/search?name_equals="+ciudad+"&maxRows=10&username=RX159"


	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{		
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				if(ciudad == response.body.geonames[0].toponymName)
				{
					//Saving the relevant data
					const Lon = data.lng
					const Lat = data.lat
					//Separate callback
					callback(Lat,Lon)

				}
				else
				{
					console.log("Error, Ciudad/Lugar mal escrita /o no especificado")

				}
				
			}
			

			
		}
		
	})

}
/* this used to be the code, that searched the whole world
const World = function()
{

	const url = 'http://api.geonames.org/earthquakesJSON?north=900&south=-90&east=180&west=-180&date<=2018-03-06&username=rx159'

	//console.log(url)
	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			console.log(response.body)
			
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				console.log(response.body.earthquakes)
				//console.log('----------')
				for (var i = 0; i<response.body.earthquakes.length ; i++)
				{
					//console.log(response.body.earthquakes[i])
					markers[i] = response.body.earthquakes[i]
					//console.log(markers[i])
				}

				//console.log(markers)
				//callback(markers)
				
			}
			
			

			
		}
		
	})
}
*/
//The fucntion that the route would guide us to
//This function is for the top 10 earthquakes
const searchEarthQuakes = function(req, res) {
	//The place would com in the form of a request
	var Lugar = req.Lugar
	geocode(Lugar, function(Code,Ciudad) 
	{
		geocode2(Code,Ciudad, function(North, South, East, West, ciudad)
		{
			geocode3(North, South, East, West, ciudad,) //function(markers)
			{
				/*The code for the world markers
				World(function(wmarkers)
				{
					console.log(wmarkers)
				})
				*/
				//The return of the markers in the form of a response
				return res.send(markers)
			}//)
		})

	})
}

//The function to get the specific lon and lat of the place
const searchlocation = function(req, res) {
	
	var Lugar = req.Lugar
	geocode4(Lugar, function(Lat,Lon) 
	{
		location = {
			Latitude : Lat,
			Longitud : Lon
		}

		return res.send(location)

	})
}

//Exporting the functions for the routes
module.exports = {
  searchEarthQuakes : searchEarthQuakes,
  searchlocation : searchlocation
}

//Listening for the port, given that app is the main space
app.listen(port, function() {
  console.log('Server up and running on port ' + port)
})
