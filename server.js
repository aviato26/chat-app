
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
const multer = require('multer');
const upload = multer({dest: 'images'});
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

/*
  // working on this feature

app.post('/image', upload.single('file'), (req, res) => {
  console.log(req.file)
  res.sendFile(req.file.path)
  }
)
*/
app.post('/login', (req, res) => {
  users.find({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
  .then(data => {
    let user = {id: data.id, name: data.name}
      res.send(user)
  })
  .catch(err => res.send(err))
})

app.post('/userData', (req, res) => {

  // using sequelize to update users location every 5 seconds

  users.findById(req.body.id)
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
      return (c.id !== parseInt(req.body.id)) && (c.latitude - req.body.lat < 0.000277) && (c.longitude - req.body.long < 0.000277) && (c.latitude !== null && c.longitude !== null)
    })
  })
  // send the filtered data back to client side
  .then(data => res.send(data))
  .catch(data => console.log(data))
})

// setting up web socket connection

// if we define a object it works to but exactly the same and without a database so will use sequelize for now
 //let user = {}

  socket.on('connection', (client) => {
// updating client id to db everytime user logs in
  console.log('connected')

    client.on('setuserid', (msg) => {
     users.findById(msg.id)
      .then(data => {
        data.update({
          socketId: client.id
        })
      })
      .catch(err => console.log(err))
      //user[`${msg.id}`] = client.id
    })

// uses sequelize to find the other user by there id and sending there message along

    client.on('private message', (msg) => {
      users.findById(msg.otherUserId)
        .then(data => {
          client.broadcast.to(data.socketId).emit('output', msg)
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
