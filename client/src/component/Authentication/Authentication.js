import React, { useState, useEffect, useContext } from "react";

import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";
import UserContext from "context";

import styles from "./authentication.module.css";

const mutation_login = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const mutation_register = gql`
  mutation register($name: String!, $email: String!, $password: String!) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const Authentication = ({ isLogin }) => {
  const [mutate, { data, error }] = useMutation(
    isLogin ? mutation_login : mutation_register
  );

  const { user, login } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const authenticate = () => {
    mutate({ variables: { email, password, name } });
  };

  useEffect(() => {
    if (data) {
      const source = isLogin ? data.login : data.register;
      login(source.user, source.token);
    }
  }, [data]);

  return (
    <div className={styles.main}>
      {!user && (
        <>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          {!isLogin && (
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <button onClick={authenticate}>
            {" "}
            {isLogin ? "Login" : "Register"}
          </button>
        </>
      )}
    </div>
  );
};

export default Authentication;
