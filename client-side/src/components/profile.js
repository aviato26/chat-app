import React from 'react';
import './talkboxstyles.css';

let Profile = (props) => {
  return(
    <div className='flex-container'>
      {
        props.userName.map((c,i) => {
        return <div key={i} className='talkbox grid-item'>
                  <img src={sessionStorage.img}/>
                  <p onClick={props.talkbox}>{c.name}</p>
               </div>
        })
      }
    </div>
  )
}

export default Profile
