import React from 'react';
import './talkboxstyles.css';

let Profile = (props) => {
  return(
    <div className='flex-container'>
      {
        props.userName.map((c,i) => {
          return <p onClick={props.talkbox} className='talkbox grid-item' key={i}>{c.name}</p>
        })
      }
    </div>
  )
}

export default Profile
