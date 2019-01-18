import React from 'react';

let Home = () => {

  componentDidMount(){

    let options = {
      enableHighAccuracy: false,
      timeout: 5000
    };

    if(sessionStorage.id){
      navigator.geolocation.watchPosition((pos) => {
        fetch('http://localhost:5000/', {
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
        .then(data => data.text())
        .then(res => console.log(res))
        .catch(err => console.log(err))
      }, (err) => console.log(err), options)
    }
  }

  return(
    <div>

    </div>
  )
}

export default Home;
