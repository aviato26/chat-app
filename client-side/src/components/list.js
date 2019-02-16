import React from 'react';
import './talkboxstyles.css';
import { Redirect } from 'react-router-dom';


class TalkBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      text: '',
      talking: [],
      switchToHome: false
    }
  }

  componentDidMount(){
    this.props.socket.on('output', (data) => {
      this.setState({
        messages: [...this.state.messages, data.text],
        talking: [...this.state.talking, sessionStorage.talkingTo]
      })
    })
  }

// function for sending the both user id's and text to the websocket
  sendText = () => {
    this.props.socket.emit('setuserid', {
      id: sessionStorage.id,
      name: sessionStorage.name
    })
      this.props.socket.emit('private message', {
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
    this.setState({
      switchToHome: true
    })
  }

  render(){
    if(this.state.switchToHome){
      return <Redirect to='/home' />
    }
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
