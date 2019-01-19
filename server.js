
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

app.post('/login', (req, res) => {
  users.find({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
  .then(data => {
    let user = {id: data.id}
      res.send(user)
  })
  .catch(err => res.send(err))
})

app.post('/userData', (req, res) => {
  users.findById(req.body.id)
  .then(data => {
    data.update({
      latitude: req.body.lat,
      longitude: req.body.long
    })
    .catch(err => res.send(err))
  })
  users.findAll()
  .then(data => {
    return new Array(...data).filter(c => {
      return (c.id !== parseInt(req.body.id)) && (c.latitude - req.body.lat < 0.000277) && (c.longitude - req.body.long < 0.000277) && (c.latitude !== null && c.longitude !== null)
    })
  })
  .then(data => res.send(data))
  .catch(data => console.log(data))
})

app.get('/signout', (req, res) => {
  users.findAll()
  .then(data => res.send(data))
  .catch(err => res.send(err))
})

sql.sync()
   .then(() => {
     app.listen(5000, console.log('server is running'))
   })
