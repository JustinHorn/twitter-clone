import React, { useState, useEffect } from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import MainPage from "pages/MainPage";

import UserFeed from "pages/UserFeed";
import Navbar from "component/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar></Navbar>
        <Switch>
          <Route path="/user/:id">
            <UserFeed></UserFeed>
          </Route>
          <Route path="/">
            <MainPage></MainPage>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
