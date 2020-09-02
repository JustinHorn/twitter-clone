import React, { useState, useEffect } from "react";

import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";

const author = "me" + Math.random();

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

const query_authorize = gql`
  query {
    authorize {
      id
      name
      email
    }
  }
`;

const Authentication = () => {
  const { loading: q_loading, error: q_error, data: q_data } = useQuery(
    query_authorize
  );

  const [isLogin, setIsLogin] = useState(true);

  const [mutate, { data, error }] = useMutation(
    isLogin ? mutation_login : mutation_register
  );

  const [user, setUser] = useState();

  const confirm = async (data) => {
    const source = isLogin ? data.login : data.register;
    setUser(source.user);
    const { token } = source;
    saveUserData(token);
  };

  const saveUserData = (token) => {
    localStorage.setItem("auth_token", token);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const authenticate = () => {
    mutate({ variables: { email, password, name } });
  };

  useEffect(() => {
    if (data) {
      confirm(data);
    }
  }, [data]);

  useEffect(() => {
    if (q_data) {
      setUser(q_data.authorize);
    }
  }, [q_data]);

  const logout = () => {
    localStorage.setItem("auth_token", "");
    setUser(null);
  };

  return (
    <div>
      {(!user && (
        <>
          <label htmlFor="">Login</label>
          <input
            type="checkbox"
            checked={isLogin}
            onClick={() => setIsLogin(true)}
          />
          <label htmlFor="">Register</label>
          <input
            type="checkbox"
            checked={!isLogin}
            onClick={() => setIsLogin(false)}
          />
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
      )) || <button onClick={logout}>Logout</button>}

      <h1>Hello {user?.name}</h1>
    </div>
  );
};

export default Authentication;
