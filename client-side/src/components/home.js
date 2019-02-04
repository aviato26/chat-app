import React from 'react';
import Profile from './profile.js';
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
  let otherUserId = this.state.names.filter(c => e.target.textContent === c.name)
  sessionStorage.interaction = otherUserId[0].id
  this.props.history.replace('/message')
}

  render(){
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
