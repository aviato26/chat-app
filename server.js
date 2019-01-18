
const express = require('express');
const app = express();
const users = require('./models').User;
const createUser = require('./serverMiddleWare/setCoordinates.js');
const parser = require('body-parser');
const sql = require('./models').sequelize

app.use(parser());

app.use((req, res, next) => {
  // settings for CORS acceptance
 res.header("Access-Control-Allow-Origin", "http://localhost:3000");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.post('/signup', createUser, (req, res) => {
  let user = {id: req.userId}
  res.send(user)
});

app.get('/signout', (req, res) => {
  users.findAll()
  .then(data => data)
  .then(data => res.send(data))
  .catch(err => res.send(err))
})

sql.sync()
   .then(() => {
     app.listen(5000, console.log('server is running'))
   })
