import React, { useState, useEffect } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import Post from "component/Post";

import Feed from "component/Feed";

import Authentication from "component/Authentication";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";

import Message from "component/Message";

function App() {
  const [show, setShow] = useState("not");

  const getOnClick = (type) => () => {
    if (type === show) {
      setShow("not");
    } else {
      setShow(type);
    }
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/user/:id">
            <UserFeed></UserFeed>
          </Route>
          <Route path="/">
            <div className="nav">
              {["Login", "Register"].map((option) => (
                <>
                  <button
                    type="checkbox"
                    className={option === show ? "active" : ""}
                    onClick={getOnClick(option)}
                  >
                    {option}
                  </button>
                </>
              ))}
            </div>

            <div className={show === "not" ? "hide" : ""}>
              <Authentication isLogin={show === "Login"}> </Authentication>
            </div>
            <Post />
            <Feed />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

const userQuery = gql`
  query($userId: Int!) {
    user(id: $userId) {
      id
      name
      email
      messages {
        timeStamp
        text
      }
    }
  }
`;

const UserFeed = () => {
  const { id } = useParams();
  const { loading, data, error } = useQuery(userQuery, {
    variables: { userId: Number(id) },
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data) {
      const author = data.user.name;
      const feed = data.user.messages.map((x) => ({
        ...x,
        author,
        userId: id,
        timeStamp: Number(x.timeStamp),
      }));
      setMessages(feed);
    }
  }, [data]);

  if (loading) return <div>loading</div>;
  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  return (
    <div className="messages">
      {messages.map((x, index) => (
        <Message key={index} {...x} />
      ))}
    </div>
  );
};
