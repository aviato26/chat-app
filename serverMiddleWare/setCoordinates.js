
let users = require('../models').User

let createUser = (req, res, next) => {
  // this will check if the coordinates are within a 100ft or so
  /*
   req.body.lat - 33.863793 < 0.000277
   */
   /*
   users.create({location: req.body.lat})
    .then(data => console.log(data))
    .catch(err => err)
    */
    users.create({
      name: req.body.name,
      email: req.body.email,
      active: req.body.active,
      password: req.body.password
    })
     .then((data) => {
       req.userId = data.id
       return next()
     })
     .catch(err => res.send(err))
}

module.exports = createUser
