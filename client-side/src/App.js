import React, { Component } from 'react';
import './App.css';

class App extends Component {

sendUserData = (e) => {

let id;

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
          lat: pos.coords.latitude,
          long: pos.coords.longitude
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

  render() {
    return (
      <div className="App">
        <h1>nosedive</h1>
        <button onClick={this.sendUserData} style={{width: '100px', height: '100px'}}>Start</button>
        <button onClick={this.sendUserData} style={{width: '100px', height: '100px'}}>Stop</button>
      </div>
    );
  }
}

export default App;
