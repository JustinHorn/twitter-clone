import React, { useState, useEffect } from "react";
import "./App.css";

import Post from "component/Post";

import Feed from "component/Feed";

import Authentication from "component/Authentication";

function App() {
  return (
    <div className="App">
      <Authentication> </Authentication>

      <Post />
      <Feed />
    </div>
  );
}

export default App;
