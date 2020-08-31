import React, { useState, useEffect } from "react";
import "./App.css";

import Message from "component/Message";

import { gql, useQuery, useMutation } from "@apollo/client";

const FEED_QUERY = gql`
  query feedQuery($take: Int, $skip: Int, $orderBy: MessageOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      author
      text
      timeStamp
    }
  }
`;

const ADDMESSAGE_MUTATION = gql`
  mutation addMessageMutation($author: String!, $text: String!) {
    addMessage(author: $author, text: $text) {
      id
      author
      text
      timeStamp
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription newMessage {
    newMessage {
      id
      author
      text
      timeStamp
    }
  }
`;

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

  const { subscribeToMore, loading, error, data } = useQuery(FEED_QUERY, {
    variables: { take: 10, orderBy: { id: "desc" } },
  });

  useEffect(() => {
    if (data) {
      const feed = data.feed.map((x) => ({
        ...x,
        timeStamp: Number(x.timeStamp),
      }));
      setMessages(feed);
    }
  }, [data]);

  useEffect(() => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        const newItem = subscriptionData.data.newMessage;
        return Object.assign({}, prev, {
          feed: [newItem, ...prev.feed],
        });
      },
    });
  }, []);

  const [mutate, { m_data, m_error }] = useMutation(ADDMESSAGE_MUTATION);

  const send = (e) => {
    if (isTextLegit(text)) {
      e.preventDefault();
      mutate({ variables: { author: author, text } });
    }
  };

  useEffect(() => {
    if (m_error) {
      console.log(m_error);
      alert("Mutation error");
    }
  }, [m_error]);

  if (loading) return <div>loading</div>;
  if (error) {
    console.log(error);
    return <div>error</div>;
  }

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
        />
        <button onClick={send}>SEND</button>
      </div>
      <div className="messages">
        {messages.map((x, index) => (
          <Message key={index} {...x} />
        ))}
      </div>
    </div>
  );
}

export default App;
