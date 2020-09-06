import React from "react";

import Message from "component/Message";

export const showFeed = (loading, error, messages) => {
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
