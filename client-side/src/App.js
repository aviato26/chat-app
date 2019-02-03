import React, { Component } from 'react';
import Signup from './components/signup.js';
import Login from './components/login.js';
import TalkBox from './components/list.js';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Home from './components/home.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path='/' component={Signup} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/message' component={TalkBox} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
