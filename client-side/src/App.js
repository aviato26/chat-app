import React, { Component } from 'react';
import Signup from './components/signup.js';
import Login from './components/login.js';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Home from './components/home.js';
import './App.css';

class App extends Component {

/*
sendUserData = (e) => {

let id;
let getName = document.querySelector('input').value;

  let options = {
    enableHighAccuracy: false,
    timeout: 5000
  };

  id = navigator.geolocation.watchPosition((pos) => {
    fetch('http://localhost:5000/', {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          name: getName,
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
          active: true
      })
    })
    .then(data => data.text())
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }, (err) => console.log(err), options)

  if(e.target.textContent === 'Stop'){
    navigator.geolocation.clearWatch(id)
  }
}

send = () => {

let getName = document.querySelector('input').value

  fetch('http://localhost:5000/signout', {
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: getName,
        active: false
    })
  })
  .then(data => data.text())
  .then(res => console.log(res))
  .catch(err => console.log(err))
}
*/
/*
createUser = (e) => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition((pos) => {
    fetch('http://localhost:5000/signup', {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.state,
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      })
    })
    .then(data => data.text())
    .then(res => {
      if(res === 'user created'){
        return <Redirect to='/home' />
      } else {
        console.log('form is invalid')
      }
    })
    .catch(err => console.log(err))
  }, (err) => console.log(err))
}

getUserName = (e) => {
  this.setState({
    name: e.target.value
  })
}

getEmail = (e) => {
  this.setState({
    email: e.target.value
  })
}

getPassword = (e) => {
  this.setState({
    password: e.target.value
  })
}
*/

  render() {
    return (
      <BrowserRouter>
        <div className='grid-container'>
          <Route exact path='/' component={Signup} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/login' component={Login} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
