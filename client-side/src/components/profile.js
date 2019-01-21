import React from 'react';
import './talkboxstyles.css'

let Profile = (props) => {
  return(
    <div>
      {
        props.userName.map((c,i) => {
          return <p onClick={props.talkbox} className='talkbox' key={i}>{c}</p>
        })
      }
    </div>
  )
}

export default Profile
