import React from "react";
import moment from "moment";

import styles from "./message.module.css";

const Message = ({ author, timeStamp, text }) => {
  return (
    <div className={styles.message}>
      <div className="headline">
        <span className={styles.author}>{author}</span>
        <span className="moment">
          {moment(timeStamp).format("DD.MM.YYYY HH:MM")}
        </span>
      </div>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default Message;
