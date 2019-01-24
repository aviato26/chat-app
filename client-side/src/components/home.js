import React from 'react';
import Profile from './profile.js';
import opensocket from 'socket.io-client';
import './talkboxstyles.css';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      names: [],
      conversation: '',
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
        socket: opensocket.connect('/')
      })

      id = navigator.geolocation.watchPosition((pos) => {
        fetch('/userData', {
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

}


  render(){
    {
      let talking = [];
      if(this.state.talkbox){

        this.state.socket.once('output', (data) => {
          let promise = new Promise((resolve, reject) => {
          if(data.text.length){
            resolve(data.text)
          } else {
            reject('aint working')
          }
        })
        promise.then(data => {
          this.setState({
            conversation: data
          })
        })
      })
        return(
          <div className='grid-item grid-background' style={{textAlign: 'center'}}>
            <p style={{fontSize: '1.5em'}}>{this.state.conversation}</p>
            <input></input>
            <button onClick={this.sendText} style={{background: 'white'}}>Submit</button>
            <button onClick={this.activeTalk} style={{width: '10%', height: '10%', background: 'white', display: 'block', margin: '5% auto'}}>X</button>
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
