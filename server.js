
const express = require('express');
const app = express();
const coords = require('./serverMiddleWare/setCoordinates.js');
const parser = require('body-parser');
const use = require('./serverMiddleWare/find.js');
const sql = require('./models').sequelize

app.use(parser());

app.use((req, res, next) => {
  // settings for CORS acceptance
 res.header("Access-Control-Allow-Origin", "http://localhost:3000");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.post('/signup', coords, (req, res) => {
  
})

app.post('/signout', use, (req, res) => {

})

sql.sync()
   .then(() => {
     app.listen(5000, console.log('server is running'))
   })
