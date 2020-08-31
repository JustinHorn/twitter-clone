import React, { useState, useEffect } from "react";
import "./App.css";

import Post from "component/Post";

import Feed from "component/Feed";

const author = "me" + Math.random();

function App() {
  return (
    <div className="App">
      <Post author={author} />
      <Feed />
    </div>
  );
}

export default App;
