import React from 'react';
import Profile from './profile.js';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      names: []
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


  render(){
    return(
      <div>
        <h1>Cool</h1>
        <Profile userName={this.state.names}/>
      </div>
    )
  }
}

export default Home;
