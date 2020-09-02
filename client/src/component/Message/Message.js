import React from "react";
import moment from "moment";

import styles from "./message.module.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Message = ({ author, timeStamp, text, userId }) => {
  return (
    <div className={styles.message}>
      <div className="headline">
        <Link className={styles.author} to={"/user/" + userId}>
          {author}
        </Link>
        <span className="moment">
          {moment(timeStamp).format("DD.MM.YYYY hh:mm")}
        </span>
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default Message;
