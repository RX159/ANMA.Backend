// GET USERS ya no esta en routes.js ya que un usuario no debería tener acceso
// a la informacion de TODOS los usuarios a menos que sea administrador
const getEarthquakes = function(req, res) {
  User.find({}).then(function(users) {
    res.send(users)
  }).catch(function(error){
    res.status(500).send(error)
  })
}


module.exports = {
  getEarthquakes : getEarthquakes
}