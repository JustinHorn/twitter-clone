import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";
import { showFeed } from "helper";

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

  const author = data?.user.name;

  const messages = data?.user.messages.map((x) => ({
    ...x,
    author,
    userId: id,
    timeStamp: Number(x.timeStamp),
  }));

  return showFeed(loading, error, messages);
};

export default UserFeed;
