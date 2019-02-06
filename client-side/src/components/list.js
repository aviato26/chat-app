import React from 'react';
import './talkboxstyles.css';
import opensocket from 'socket.io-client';


class TalkBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      socket: opensocket.connect(),
      text: '',
      talking: []
    }
  }

  getSnapshotBeforeUpdate(props, state){
    if(state.messages !== this.state.messages){
      return this.state.messages
    }
    return null
  }

  componentDidUpdate(props, state, snapshot){
    // must check for state text or will emit to socket multiple times

    if(snapshot !== null && state.text !== ""){

      // must use once on socket instead of on or the messages will emit several times
      this.state.socket.once('output', (data) => {
        this.setState({
          messages: [...this.state.messages, data.text],
          talking: [...this.state.talking, sessionStorage.talkingTo]
        })
      })
    }
  }

// function for sending the both user id's and text to the websocket
  sendText = () => {
    this.state.socket.emit('setuserid', {
      id: sessionStorage.id,
      name: sessionStorage.name
    })
      this.state.socket.emit('private message', {
        id: sessionStorage.id,
        otherUserId: sessionStorage.interaction,
        text: this.state.text
      })
    this.setState({
      messages: [...this.state.messages, this.state.text],
      talking: [...this.state.talking, sessionStorage.name]
    })
      this.setState({
        text: ''
      })
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
      <div className='grid-container'>
        <ul>
        {
          this.state.messages.map((c,i) => {
            return <li key={i}>{this.state.talking[i]}: {c}</li>
          })
        }
        </ul>
        <input style={{height: '30px'}} onChange={this.onChange} value={this.state.text}></input>
        <button onClick={this.sendText} style={{background: 'white', height: '30px'}}>Submit</button>
        <button onClick={this.backHome} style={{width: '30px', height: '30px', background: 'white', display: 'block', margin: '5% auto'}}>X</button>
      </div>
    )
  }
}

export default TalkBox
