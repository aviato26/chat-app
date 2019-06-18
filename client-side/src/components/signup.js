import React from 'react';
import { Link } from 'react-router-dom';

let Signup = (props) => {

  let name = null;
  let email = null;
  let password = null;
  let image = {};

let CreateUser = (e) => {
      e.preventDefault();
        fetch('/signup', {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value,
            active: true
          })
        })
        .then(data => {
          return data.json()
        })
        .then(res => {
          if(!!res.id){
            sessionStorage.id = res.id
            props.history.replace('/home')
          } else {
            console.log('form is invalid')
          }
        })
        .catch(err => console.log(err))
        e.target.reset();
    }

/*
  // working on this feature, will finish after UI is done
  // (this feature will send the uploaded pic to the server)

    let FileSelected = (e) => {
      image.url = document.querySelectorAll('input')[2];
      let pic = document.querySelector('img');
      e.preventDefault()

      let data = new FormData();
      data.append('file', e.target.files[0]);

      fetch('/image', {
        method: 'POST',
          body: data
      })
        .then(res => res.json())
        .then(data => {
          pic.src = data.path
          console.log(image.url)
        })
        .catch(err => console.log(err))
    }

    */

  return(
    <div className='grid-container signup'>
      <div className='grid-item'>
        <h1 data-text="SignUp" className='glow'>
            SignUp
        </h1>
        <p className='intro'>once logged in this app will show you everyone logged in within a hundred feet</p>
        <p className='intro'>click on the desired user to chat with them</p>
        <p className='intro'>if the other user accepts you will be redirected to the private chat room</p>
      </div>
      <div className='grid-item'>
        <form onSubmit={CreateUser}>
          <div className='signupInputs'>
            <input placeholder='Enter Name' ref={(text) => {name = text}} required></input>
          </div>
          <div className='signupInputs'>
            <input placeholder='Email' ref={(text) => {email = text}} required></input>
          </div>
          <div className='signupInputs'>
            <input placeholder='Password' ref={(text) => {password = text}} required></input>
          </div>
            <button style={{width: '20%', height: '50px'}}>Send</button>
        </form>
        <Link to='login'><button style={{width: '20%', height: '50px'}}>Log In</button></Link>
        </div>
    </div>
  )
}

export default Signup;
