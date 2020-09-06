import React, { useState, useEffect } from "react";

import { gql } from "apollo-boost";

import { useMutation, useQuery } from "@apollo/client";

const query_authorize = gql`
  query {
    authorize {
      id
      name
      email
    }
  }
`;

const UserContext = React.createContext();
export default UserContext;

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  useAutomaticAuthorize(setUser);

  const logout = () => {
    localStorage.setItem("auth_token", "");
    setUser(null);
  };

  const login = (user, token) => {
    setUser(user);
    saveUserData(token);
  };

  const saveUserData = (token) => {
    localStorage.setItem("auth_token", token);
  };

  return (
    <UserContext.Provider value={{ user, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

const useAutomaticAuthorize = (setUser) => {
  const { loading: q_loading, error: q_error, data: q_data } = useQuery(
    query_authorize
  );

  useEffect(() => {
    if (q_data) {
      setUser(q_data.authorize);
    }
  }, [q_data]);
};
