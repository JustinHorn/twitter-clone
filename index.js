const { GraphQLServer } = require("graphql-yoga");

const { resolvers } = require("./server/resolvers");

const server = new GraphQLServer({
  typeDefs: "./server/schema.graphql",
  resolvers,
});

const options = {
  port: process.env.port || 4000,
  endpoint: "/graphql",
  playground: "/graphql",
};

server.start(options, () => console.log("Server startet!"));
