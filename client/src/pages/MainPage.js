import React, { useState, useContext } from "react";

import styles from "./mainpage.module.css";

import Post from "component/Post";

import Feed from "component/Feed";

import UserContext from "context";

const MainPage = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <h2>Hello {user?.name}</h2>

      <Post />
      <Feed />
    </>
  );
};

export default MainPage;
