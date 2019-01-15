
let users = require('../models').User;

let user = (req) => {
  users.find()
  .then(data => console.log(data))
  .catch(err => err)
}

module.exports = user
