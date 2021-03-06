
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const users = require('./models').User;
const createUser = require('./serverMiddleWare/setCoordinates.js');
const parser = require('body-parser');
const sql = require('./models').sequelize;
const socket = require('socket.io')(server);
let port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs');

app.use(parser());

app.use((req, res, next) => {
  // settings for CORS acceptance
 res.header("Access-Control-Allow-Origin", "http://localhost:3000");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 res.header("Access-Control-Allow-Credentials", true)
  next();
})

app.post('/signup', createUser, (req, res) => {
  let user = {id: req.userId}
  res.send(user)
});

app.post('/login', (req, res) => {
  users.findAll({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
  .then(data => {
    let user = {id: data[0].id, name: data[0].name}
      res.send(user)
  })
  .catch(err => res.send(err))
})

app.post('/userData', (req, res) => {

  // using sequelize to update users location every 5 seconds

  users.findByPk(req.body.id)
  .then(data => {
    data.update({
      latitude: req.body.lat,
      longitude: req.body.long
    })
    .catch(err => res.send(err))
  })
  users.findAll()
  // this is checking the users lat and long to see if any other users are near by (this should be about a 100ft radius)

  .then(data => {
    return new Array(...data).filter(c => {
      return (c.id !== parseInt(req.body.id)) && ((c.latitude - req.body.lat) < 0.000277 || (-c.latitude - -req.body.lat) < 0.000277) && ((c.longitude - req.body.long) < 0.000277 || (-c.longitude - -req.body.long) < 0.000277) && (c.latitude !== null && c.longitude !== null)
    })
  })
  // send the filtered data back to client side
  .then(data => {
    res.send(data)
  })
  .catch(data => console.log(data))
})

// setting up web socket connection

  socket.on('connection', (client) => {
// updating client id to db everytime user logs in
  console.log('connected')
  //user[`${msg.id}`] = client.id

  client.on('accepted', (msg) => {
    users.findByPk(msg.sendTo)
    .then(data => {
      socket.to(data.socketId).emit('accepted', { answer: msg.answer})
    })
  })

  client.on('greet', (msg) => {
    console.log(msg)
    users.findByPk(msg.chatWith)
    .then(data => {
      socket.to(data.socketId).emit('converse', { greet: `${msg.talkingTo} wants to talk, would you like to chat`, otherId: msg.chatWith, id: msg.id})
    })
  })

    client.on('setuserid', (msg) => {
     users.findByPk(msg.id)
      .then(data => {
        data.update({
          socketId: client.id
        })
      })
      .catch(err => console.log(err))
    })

// uses sequelize to find the other user by there id and sending there message along

    client.on('private message', (msg) => {
      users.findByPk(msg.otherUserId)
        .then(data => {
          socket.to(data.socketId).emit('output', msg)
        })
          //socket.to(`${user[`${msg.otherUserId}`]}`).emit('output', msg)
      })

  })

// setup for heroku, basically telling heroku in production use the react build folder for UI

  if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client-side/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client-side', 'build', 'index.html'))
    })
  }

// method for syncing sql db

sql.sync()
   .then(() => {
     server.listen(port, console.log('server is running'))
   })
