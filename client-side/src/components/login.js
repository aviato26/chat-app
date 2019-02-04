import React from 'react';
import { Link } from 'react-router-dom';
import './talkboxstyles.css'

let Login = (props) => {

  let email = null;
  let password = null;

let GetUser = (e) => {
      e.preventDefault();

        fetch('/login', {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          })
        })
        .then(data => {
          return data.json()
        })
        .then(res => {
          if(!!res.id){
            sessionStorage.id = res.id;
            sessionStorage.name = res.name;
            props.history.replace('/home')
          } else {
            console.log('form is invalid')
          }
        })
        .catch(err => console.log(err))
        e.target.reset();
    }

  return(
    <div className='grid-container login'>
      <div>
        <h1 className='glow'>Log In</h1>
      </div>
      <div>
        <form onSubmit={GetUser}>
            <input placeholder='Email' ref={(text) => {email = text}} style={{display: 'block'}} required></input>
            <input placeholder='Password' ref={(text) => {password = text}} style={{display: 'block'}}required></input>
            <button style={{width: '50px', height: '50px'}}>Start</button>
        </form>
        <Link to='/'><button>Sign Up</button></Link>
        </div>
    </div>
  )
}

export default Login;
