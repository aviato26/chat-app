import React from 'react';
import './talkboxstyles.css';
import opensocket from 'socket.io-client';

class TalkBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      socket: '',
      text: ''
    }
  }

  componentDidMount(){
// on mount the socket connection is established and the user id is sent along With
// the other users id that was clicked on, after this the private message room is
// connected between the two users

    let promise = new Promise((resolve, reject) => {
      if(this.state.socket === ''){
        resolve(this.state.socket)
      } else {
        reject('socket has not connected')
      }
    })
    promise.then(() => {
      this.setState({
        socket: opensocket.connect('/')
      })
    })
    .then(() => {
      this.state.socket.emit('setuserid', {
        id: sessionStorage.id
      })
    })
    .then(() => {
      this.state.socket.emit(`private message`, {
        id: sessionStorage.id,
        otherUserId: sessionStorage.interaction,
      })
      // this function does the same thing as the emit function above but is the only way to establish connection
      // so far
      this.sendText()
    })
    .catch(err => console.log(err))
  }

// function waiting for response from the other user and adds it to state to be displayed
  anotherText = () => {
    this.state.socket.once('output', (data) => {
      this.setState({
        messages: [...this.state.messages, data.text]
      })
  })
}

// function for sending the both user id's and text to the websocket
  sendText = () => {
      this.state.socket.emit(`private message`, {
        id: sessionStorage.id,
        otherUserId: sessionStorage.interaction,
        text: this.state.text
      })
      this.anotherText()
  }

// will update state on each keystroke in the input element
  onChange = (e) => {
    this.setState({
      text: e.target.value
    })
  }

// will send user back to the home page
  backHome = () => {
    this.props.history.replace('/home')
  }

  render(){
    return(
      <div>
        <ul>
          {
            this.state.messages.map((c,i) => {
              return <li key={i}>{c}</li>
            })
          }
        </ul>
        <input onChange={this.onChange}></input>
        <button onClick={this.sendText} style={{background: 'white'}}>Submit</button>
        <button onClick={this.backHome} style={{width: '10%', height: '10%', background: 'white', display: 'block', margin: '5% auto'}}>X</button>
      </div>
    )
  }
}

export default TalkBox
