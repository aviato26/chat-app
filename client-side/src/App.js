import React, { Component } from 'react';
import './App.css';

class App extends Component {

sendUserData = () => {
  navigator.geolocation.watchPosition((pos) => {
    sessionStorage.setItem('lat', pos.coords.latitude);
    sessionStorage.setItem('long', pos.coords.longitude);
    /*
    fetch('http://localhost:5000/', {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

      })
    })
    .then(data => data.text())
    .then(res => console.log(res))
    .catch(err => console.log(err))*/
  }, (err) => console.log(err))
  setInterval(() => console.log(sessionStorage), 3000)
}

  render() {
    return (
      <div className="App">
        <h1>nosedive</h1>
        <button onClick={this.sendUserData} style={{width: '100px', height: '100px'}}></button>
      </div>
    );
  }
}

export default App;
