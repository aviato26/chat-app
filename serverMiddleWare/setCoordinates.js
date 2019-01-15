
let users = require('../models').User

let coords = (req, res) => {
  // this will check if the coordinates are within a 100ft or so
  /*
   req.body.lat - 33.863793 < 0.000277
   */
   /*
   users.create({location: req.body.lat})
    .then(data => console.log(data))
    .catch(err => err)
    */
    let newUser = {
      name: req.body.user.name,
      email: req.body.user.email,
      lat: req.body.lat,
      long: req.body.long,
      active: req.body.user.active
    }

    users.create({
      name: newUser.name,
      email: newUser.email,
      latitude: newUser.lat,
      longitude: newUser.long,
      active: true
    })
     .then(data => res.send(data))
     .catch(err => err)
}

module.exports = coords
