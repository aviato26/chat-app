import React from 'react';
import Profile from './profile.js';
import opensocket from 'socket.io-client';
import './talkboxstyles.css';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      names: [],
      talkbox: false
    }
  }


  componentDidMount(){

    let options = {
      enableHighAccuracy: false,
      timeout: 5000
    }

    let id;

    if(sessionStorage.id){
      id = navigator.geolocation.watchPosition((pos) => {
        fetch('http://localhost:5000/userData', {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
              id: sessionStorage.id,
              lat: pos.coords.latitude,
              long: pos.coords.longitude
          })
        })
        .then(data => data.json())
        .then(res => {
          this.setState({
            names: res.map(c => c.name)
          })
        })
        .catch(err => console.log(err))
      }, (err) => console.log(err), options)
    } else {
      navigator.geolocation.clearWatch(id)
    }
  }

activeTalk = () => {
  this.setState({
    talkbox: !this.state.talkbox
  })
  fetch('/connection',{
    method: "POST",
    headers: {
      "Accept": "application/json, text/plain",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        id: sessionStorage.id
    })
  })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

sendText = () => {
  let socket = opensocket('http://localhost:5000');
  socket.on('news', (data) => {
    console.log(data);
    socket.emit('other event', {my: 'data'})
  })
}

  render(){
    {
      if(this.state.talkbox){
        return(
          <div className='grid-item grid-background'>
            <textarea className='active'></textarea>
            <button onClick={this.sendText}>Submit</button>
            <button onClick={this.activeTalk}>X</button>
          </div>
        )
      }
    }
    return(
      <div>
        <h1>Cool</h1>
        <Profile userName={this.state.names} talkbox={this.activeTalk}/>
      </div>
    )
  }
}

export default Home;
