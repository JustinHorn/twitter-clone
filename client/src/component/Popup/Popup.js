import React, { useState, useContext } from "react";

import styles from "./popup.module.css";

const Popup = ({ show, onClickAway, children }) => (
  <div className={show ? styles.popup : styles.beGone}>
    <div className={styles.menu}>{children}</div>

    <div className={styles.background} onClick={onClickAway}></div>
  </div>
);

export default Popup;
