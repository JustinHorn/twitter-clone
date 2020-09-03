const { GraphQLServer } = require("graphql-yoga");

const express = require("express");
const path = require("path");

const { resolvers } = require("./server/resolvers");

const { PrismaClient } = require("@prisma/client");

const { PubSub } = require("graphql-yoga");

//npx prisma studio --experimental
// to see the content
const prisma = new PrismaClient();

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./server/schema.graphql",
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
      pubsub,
    };
  },
});

const options = {
  port: process.env.port || 4000,
  endpoint: "/graphql",
  playground: "/graphql",
};

server.express.use(express.static(path.join(__dirname, "client", "build")));

server.start(options, () => console.log("Server startet!"));
