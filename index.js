const { GraphQLServer } = require("graphql-yoga");

const schema = `
type Query {
    hello: String!
}
`;

const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

const server = new GraphQLServer({
  typeDefs: schema,
  resolvers,
});

const options = {
  port: process.env.port || 4000,
  endpoint: "/graphql",
  playground: "/graphql",
};

server.start(options, () => console.log("Server startet!"));
