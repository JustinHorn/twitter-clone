import React, { useState, useEffect } from "react";

import { gql, useQuery, useMutation } from "@apollo/client";

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

const Post = ({ author }) => {
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

  const [mutate, { m_data, m_error }] = useMutation(ADDMESSAGE_MUTATION);

  const send = (e) => {
    if (isTextLegit(text)) {
      e.preventDefault();
      mutate({ variables: { author: author, text } });
      setText("");
    }
  };

  return (
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
  );
};

export default Post;
