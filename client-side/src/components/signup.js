import React from 'react';

let Signup = (props) => {
  return(
    <div>
      <div className='grid-item'>
        <h1>nosedive</h1>
      </div>
      <div className='grid-item'>
        <form method='POST'>
          <div className='grid-item'>
            <input placeholder='Enter Name' onChange={props.getName}></input>
          </div>
          <div className='grid-item'>
            <input placeholder='Email' onChange={props.getEmail}></input>
          </div>
            <button onClick={props.createUser} style={{width: '50px', height: '50px'}}>Start</button>
        </form>
        </div>
    </div>
  )
}

export default Signup;
