import React from 'react';
import Profile from './profile.js';
import opensocket from 'socket.io-client';
import './talkboxstyles.css';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      names: [],
      conversation: [],
      otherUserId: null,
      talkbox: false,
      socket: ''
    }
  }


  componentDidMount(){

    let options = {
      enableHighAccuracy: false,
      timeout: 30000
    }

    let id;

    if(sessionStorage.id){

      this.setState({
        socket: opensocket.connect('http://localhost:8080')
      })

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
              names: res.map(c => {
                return {
                id: c.id,
                name: c.name
              }
            })
          })
        })
        .catch(err => console.log(err))
      }, (err) => console.log(err), options)
    } else {
      navigator.geolocation.clearWatch(id)
    }
  }

activeTalk = (e) => {
  this.setState({
    talkbox: !this.state.talkbox,
    otherUserId: this.state.names.filter(c => c.name === e.target.textContent)
  })
  this.state.socket.emit('setuserid', {
    id: sessionStorage.id
  })
}

sendText = (e) => {
  let text = document.querySelector('input').value;

  this.state.socket.emit(`private message`, {
    id: sessionStorage.id,
    otherUserId: this.state.otherUserId[0].id,
    text: text
  })

  this.state.socket.on('output', (data) => {
    this.setState({
      conversation: data.text
    })
  })
}

  render(){
    {
      if(this.state.talkbox){
        return(
          <div className='grid-item grid-background'>
            <ul>
              {
                this.state.conversation.map((c,i) => {
                  return <li key={i}>{c}</li>
                })
              }
            </ul>
            <input></input>
            <button onClick={this.sendText}>Submit</button>
            <button onClick={this.activeTalk}>X</button>
          </div>
        )
      }
    }
    return(
      <div>
        <h1>Talkbox</h1>
        <Profile userName={this.state.names} talkbox={this.activeTalk} />
      </div>
    )
  }
}

export default Home;
