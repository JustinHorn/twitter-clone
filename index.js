const { GraphQLServer } = require("graphql-yoga");

const { resolvers } = require("./server/resolvers");

const { PrismaClient } = require("@prisma/client");

//npx prisma studio --experimental
// to see the content
const prisma = new PrismaClient();

const server = new GraphQLServer({
  typeDefs: "./server/schema.graphql",
  resolvers,
  context: { prisma },
});

const options = {
  port: process.env.port || 4000,
  endpoint: "/graphql",
  playground: "/graphql",
};

server.start(options, () => console.log("Server startet!"));
