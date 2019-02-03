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
      text: '',
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
  /*this.setState({
    otherUserId: this.state.names.filter(c => c.name === e.target.textContent)
  })*/
  let otherUserId = this.state.names.filter(c => e.target.textContent === c.name)
  sessionStorage.interaction = otherUserId[0].id
  this.props.history.replace('/message')
}

/*
sendText = () => {
  this.state.socket.emit(`private message`, {
    id: sessionStorage.id,
    otherUserId: this.state.otherUserId[0].id,
    text: this.state.text
  })
}

onChange = (e) => {
  this.setState({
    text: e.target.value
  })
}
*/

  render(){
    /*{
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
            conversation: [this.state.text, ...data]
          })
        })
      })

        return(
          <div className='grid-item grid-background' style={{textAlign: 'center'}}>
              <ul>
              {
                this.state.conversation.map((c,i) => {
                  return <li key={i}>{c}</li>
                })
              }
              </ul>
            <input onChange={this.onChange}></input>
            <button onClick={this.sendText} style={{background: 'white'}}>Submit</button>
            <button onClick={this.activeTalk} style={{width: '10%', height: '10%', background: 'white', display: 'block', margin: '5% auto'}}>X</button>
          </div>
        )
      } else {
    }*/
    return(
      <div className='grid-container'>
        <h1 className="victory"><span className="victory-v">T</span>alkBox</h1>
        <Profile userName={this.state.names} talkbox={this.activeTalk} />
      </div>
      )
    //}
  }
}

export default Home;
