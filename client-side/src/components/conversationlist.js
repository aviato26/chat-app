import React from 'react';

let Conversation = (props) => {
  return(
    <div className='grid-item grid-background'>
      <ul>
        {
          props.conversation.map((c,i) => {
            return <li key={i}>{c}</li>
          })
        }
      </ul>
      <input></input>
      <button onClick={this.sendText}>Submit</button>
      <button onClick={this.activeTalk}>X</button>
    </div>
  )
}

export default Conversation;
