import React, { useState, useEffect } from "react";

import Message from "component/Message";

import { gql, useQuery } from "@apollo/client";

import { showFeed } from "helper";

const FEED_QUERY = gql`
  query feedQuery($take: Int, $skip: Int, $orderBy: MessageOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      postedBy {
        id
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
        id
        name
      }
      text
      timeStamp
    }
  }
`;

const Feed = () => {
  const { subscribeToMore, loading, error, data } = useQuery(FEED_QUERY, {
    variables: { take: 10, orderBy: { timeStamp: "desc" } },
  });

  useEffect(() => {
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        const newItem = subscriptionData.data.newMessage;
        newItem.author = newItem.postedBy.name;
        newItem.userId = newItem.postedBy?.id;
        return Object.assign({}, prev, {
          feed: [newItem, ...prev.feed],
        });
      },
    });
  }, []);

  const messages = data?.feed.map((x) => ({
    ...x,
    author: x.postedBy?.name,
    userId: x.postedBy?.id,
    timeStamp: Number(x.timeStamp),
  }));

  return showFeed(loading, error, messages);
};

export default Feed;
