import React from 'react';
import Profile from './profile.js';
import { Redirect } from 'react-router-dom';
import './talkboxstyles.css';


class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      names: [],
      otherUserId: null,
      text: '',
      chatWith: '',
      talkingTo: null,
      stopTracking: null,
      switchToChat: false,
      hideGreeting: 'talk'
    }
  }


  componentDidMount(){

    let options = {
      enableHighAccuracy: false,
      timeout: 30000
    }

    if(sessionStorage.id){

      this.props.socket.emit('setuserid', {
        id: sessionStorage.id
      })

      this.state.stopTracking = navigator.geolocation.watchPosition((pos) => {
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
    }
  }

  getSnapshotBeforeUpdate(props, state){
    if(state.chatWith == ''){
      return this.state.chatWith
    } else if(state.switchToChat == false){
      return this.state.switchToChat
    }
    return null
  }

  componentDidUpdate(props, state, snapshot){
    // must check for state text or will emit to socket multiple times
    if(snapshot !== null){
      // must use once on socket instead of on or the messages will emit several times
      this.props.socket.once('converse', (data) => {
        this.setState({
          chatWith: data.greet
        })
        sessionStorage.interaction = data.id
        this.setState({
          hideGreeting: 'talking'
        })
      })

      this.props.socket.once('accepted', (data) => {
        this.setState({
          switchToChat: data.answer
        })
      })
    }
  }

  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.state.stopTracking);
  }

activeTalk = (e) => {
  let otherUserId = this.state.names.filter(c => e.target.textContent === c.name);
  sessionStorage.interaction = otherUserId[0].id;
  sessionStorage.talkingTo = e.target.textContent;
  this.props.socket.emit('greet', {
    chatWith: sessionStorage.interaction,
    id: sessionStorage.id,
    talkingTo: sessionStorage.name
  })
}

goToChatRoom = () => {
  this.setState({
    switchToChat: true
  })
  this.props.socket.emit('accepted', {
    answer: true,
    sendTo: sessionStorage.interaction
  })
}

denyChat = () => {
  this.setState({
    hideGreeting: 'talk'
  })
}

  render(){
    if(this.state.switchToChat){
      return <Redirect to='/message' />
    }
    return(
      <div className='grid-container'>
        <h1 className="victory"><span className="victory-v">T</span>alkBox</h1>
        <Profile userName={this.state.names} talkbox={this.activeTalk} />
        <div className={this.state.hideGreeting}>
          <p>{this.state.chatWith}</p>
          <button onClick={this.goToChatRoom}>Yes</button>
          <button onClick={this.denyChat}>No</button>
        </div>
      </div>
      )
  }
}

export default Home;
