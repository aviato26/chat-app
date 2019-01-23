import React from 'react';
import { Link } from 'react-router-dom';

let Login = (props) => {

  let email = null;
  let password = null;

let GetUser = (e) => {
      e.preventDefault();

        fetch('http://localhost:5000/login', {
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
            sessionStorage.id = res.id
            props.history.replace('/home')
          } else {
            console.log('form is invalid')
          }
        })
        .catch(err => console.log(err))
        e.target.reset();
    }

  return(
    <div>
      <div className='grid-item'>
        <h1>Log In</h1>
      </div>
      <div className='grid-item'>
        <form onSubmit={GetUser}>
          <div className='grid-item'>
            <input placeholder='Email' ref={(text) => {email = text}} required></input>
          </div>
          <div className='grid-item'>
            <input placeholder='Password' ref={(text) => {password = text}} required></input>
          </div>
            <button style={{width: '50px', height: '50px'}}>Start</button>
        </form>
        <Link to='/'><button>Sign Up</button></Link>
        </div>
    </div>
  )
}

export default Login;
