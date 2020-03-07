const request = require('request')
const express = require('express')
const router = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // parsea a json
app.use(router)


app.listen(port, function() {
  console.log('Server up and running on port ' + port)
})


var markers = new Array
//GoogleAPIKEY = 'AIzaSyAqfVfnIq48fSqyiSuNUbc2txi0a7IVbzY'
//Sacar la ciudad
//http://api.geonames.org/search?name_equals=Monterrey&east,west,north,south&maxRows=1&username=RX159

//Ok, el primer problema de todos es que me van a dar una ciudad o una location, de ahi tengo que sacar
//Lat y longitud, y de esos un bound box para el area.

//Todo eso lo hare con reverse GeoCoding, dentro del mismo link que me pasaron
//Usuario es RX159
//&east,west,north,south&inclBbox

const geocode = function(ciudad,callback)
{

	const url = "http://api.geonames.org/search?name_equals="+ciudad+"&maxRows=10&username=RX159"


	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			//console.log(response.body)
			
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				//console.log(response.body.geonames[0].countryCode)
				if(ciudad == response.body.geonames[0].toponymName)
				{
					//console.log(response.body)
					const data = response.body.geonames[0]
					//const Lon = data.lng
					//const Lat = data.lat
					const Code = data.countryCode
					//console.log(Lon,Lat)
					callback(Code,ciudad)

				}
				else
				{
					console.log("Error, Ciudad/Lugar mal escrita /o no especificado")

				}
				
			}
			

			
		}
		
	})

}

//http://api.geonames.org/findNearbyPlaceName?lat=25.6750698&lng=-100.3184662&east,west,north,south&username=
//http://api.geonames.org/earthquakesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&username=rx159

const geocode2 = function (Code,Ciudad,callback)
{
	//http://api.geonames.org/countryInfo?country=MX&username=RX159

	// url = 'http://api.geonames.org/earthquakesJSON?north='+North+'&south='+South+'&east='+East+'&west='+West+'.2&username=rx159'

	const url = 'http://api.geonames.org/countryInfo?country='+Code+'&username=RX159'

	//console.log(url)
	request({url, json: true}, function(error, response) 
	{ 
		//console.log(response.body.geonames[0])
		
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
				//console.log(response.body)
				const North = response.body.geonames[0].north
				const South = response.body.geonames[0].south
				const East = response.body.geonames[0].east
				const West = response.body.geonames[0].west


				callback(North,South,East,West,Ciudad)
			}
		}
		
		
	})
}

const geocode3 = function(North, South, East, West, ciudad, callback)
{

	//const url = "http://api.geonames.org/search?name_equals="+ciudad+"&maxRows=10&username=RX159"
	const url = 'http://api.geonames.org/earthquakesJSON?north='+North+'0&south='+South+'&east='+East+'&west='+West+'&date=2019-03-06&username=rx159'
	//const url = "http://api.geonames.org/search?name_equals="+ciudad+"&east=50,west=50,nort=50,sout=50&maxRows=10&username=RX159"

	//console.log(url)
	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			//console.log(response.body)
			
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				//console.log(response.body.earthquakes)
				//console.log('----------')
				for (var i = 0; i<response.body.earthquakes.length ; i++)
				{
					//console.log(response.body.earthquakes[i])
					markers[i] = response.body.earthquakes[i]
					//console.log(markers[i])
				}

				//console.log(markers)
				callback(markers)
				
			}
			

			
		}
		
	})

}


const geocode4 = function(ciudad,callback)
{

	const url = "http://api.geonames.org/search?name_equals="+ciudad+"&maxRows=10&username=RX159"


	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			//console.log(response.body)
			
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				//console.log(response.body.geonames[0].countryCode)
				if(ciudad == response.body.geonames[0].toponymName)
				{
					//console.log(response.body)
					//const data = response.body.geonames[0]
					const Lon = data.lng
					const Lat = data.lat
					//const Code = data.countryCode
					//console.log(Lon,Lat)
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
/*
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

const searchEarthQuakes = function(Lugar) {
	
	//const Lugar = 'Monterrey'
	geocode(Lugar, function(Code,Ciudad) 
	{
		geocode2(Code,Ciudad, function(North, South, East, West, ciudad)
		{
			geocode3(North, South, East, West, ciudad,) //function(markers)
			{
				console.log(wmarkers)
				/*
				World(function(wmarkers)
				{
					console.log(wmarkers)
					//console.log(markers)
				})
				*/
				res.send(markers)
			}//)
		})

	})
}


const searchlocation = function(Lugar) {
	
	//const Lugar = 'Monterrey'
	geocode4(Lugar, function(Lat,Lon) 
	{
		location = {
			Latitude : Lat,
			Longitud : Lon
		}

		res.send(location)

	})
}

module.exports = {
  searchEarthQuakes : searchEarthQuakes,
  searchlocation : searchlocation
}