import React, { useState } from "react";
import "./App.css";

import Message from "component/Message";

const author = "me" + Math.random();

function App() {
  const [text, setText] = useState("");

  const updateText = (e) => {
    const text = e.target.value;

    if (isTextLegit(text)) {
      setText(e.target.value);
    }
  };

  const isTextLegit = (text) => {
    return text.trim() && text.length <= 140 && text.split("\n").length <= 3;
  };

  const [messages, setMessages] = useState([]);

  const send = (e) => {
    if (isTextLegit(text)) {
      e.preventDefault();
      const new_message = { author: author, timeStamp: Date.now(), text };
      setMessages([new_message, ...messages]);
      setText("");
    }
  };

  return (
    <div className="App">
      <div action="" noValidate autoComplete="off" className="textInput">
        <textarea
          name=""
          value={text}
          onChange={updateText}
          placeholder="Whats up?!"
          id=""
          cols="30"
          rows="3"
        ></textarea>
        <button onClick={send}>SEND</button>
      </div>
      <div className="messages">
        {messages.map((x) => (
          <Message {...x} />
        ))}
      </div>
    </div>
  );
}

export default App;
