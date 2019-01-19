import React from 'react';

let Profile = (props) => {

  const TalkBox = (e) => {
    console.log(e.target)
  }

  return(
    <div>
      <h2>
      {
        props.userName.map((c,i) => {
          return <p onClick={TalkBox} key={i}>{c}</p>
        })
      }
      </h2>
    </div>
  )
}

export default Profile
