
let users = require('../models').User;

let user = (req, res) => {
  users.find()
  .then(data => res.send(data))
  .catch(err => res.send(data))
}

module.exports = user
