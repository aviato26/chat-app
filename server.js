
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

// setting up web socket

  socket.on('connection', (client) => {

    client.on('setuserid', (msg) => {
      users.findById(msg.id)
      .then(data => {
        data.update({
          socketId: client.id
        })
      })
      .catch(err => console.log(err))
    })

    client.on('private message', (msg) => {

      users.findById(msg.otherUserId)
      .then(data => {
        socket.sockets.to(data.socketId).emit('output', msg)
      })
    })

    client.on('disconnect', () => {
      socket.emit('user disconnected')
    })
  })

  if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client-side/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client-side', 'build', 'index.html'))
    })
  }

sql.sync()
   .then(() => {
     server.listen(port, console.log('server is running'))
   })
