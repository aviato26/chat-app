import React from 'react';
import { Link } from 'react-router-dom';

let Signup = (props) => {

  let name = null;
  let email = null;
  let password = null;

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

  return(
    <div>
      <div className='grid-item'>
        <h1>Sign Up</h1>
      </div>
      <div className='grid-item'>
        <form onSubmit={CreateUser}>
          <div className='grid-item'>
            <input placeholder='Enter Name' ref={(text) => {name = text}} required></input>
          </div>
          <div className='grid-item'>
            <input placeholder='Email' ref={(text) => {email = text}} required></input>
          </div>
          <div className='grid-item'>
            <input placeholder='Password' ref={(text) => {password = text}} required></input>
          </div>
            <button style={{width: '50px', height: '50px'}}>Start</button>
        </form>
        <Link to='login'><button>Log In</button></Link>
        </div>
    </div>
  )
}

export default Signup;
