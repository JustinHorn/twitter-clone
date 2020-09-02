import React, { useState, useEffect } from "react";

import Message from "component/Message";

import { gql, useQuery } from "@apollo/client";

const FEED_QUERY = gql`
  query feedQuery($take: Int, $skip: Int, $orderBy: MessageOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      postedBy {
        name
      }
      text
      timeStamp
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription newMessage {
    newMessage {
      id
      postedBy {
        name
      }
      text
      timeStamp
    }
  }
`;

const Feed = () => {
  const [messages, setMessages] = useState([]);

  const { subscribeToMore, loading, error, data } = useQuery(FEED_QUERY, {
    variables: { take: 10, orderBy: { timeStamp: "desc" } },
  });

  useEffect(() => {
    if (data) {
      const feed = data.feed.map((x) => ({
        ...x,
        author: x.postedBy?.name,
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
        newItem.author = newItem.postedBy.name;
        return Object.assign({}, prev, {
          feed: [newItem, ...prev.feed],
        });
      },
    });
  }, []);

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

export default Feed;
