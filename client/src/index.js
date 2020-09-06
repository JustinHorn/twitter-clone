import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { ApolloProvider, ApolloClient, HttpLink, split } from "@apollo/client";
import { InMemoryCache, ApolloLink } from "apollo-boost";

import { getMainDefinition } from "@apollo/client/utilities";

import { WebSocketLink } from "@apollo/client/link/ws";

import { UserContextProvider } from "context";

const location = window.location.host;

const isDevelopment =
  location.includes("localhost") && !location.includes("4000");

const host = isDevelopment ? "localhost:4000" : location;

const socket = location.includes("localhost") ? "ws" : "wss";
const protocol = location.includes("localhost") ? "http" : "https";

const wsLink = process.browser
  ? new WebSocketLink({
      uri: `${socket}://${host}/`,
      options: { reconnect: true },
    })
  : null;

const httpLink = new HttpLink({
  uri: `${protocol}://${host}/graphql`,
});

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = localStorage.getItem("auth_token");

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});
const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
