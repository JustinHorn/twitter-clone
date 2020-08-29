const { prismaVersion } = require("@prisma/client");

const resolvers = {
  Query: {
    hello: () => "Hello World!",
    feed: async (p, args, context) => await context.prisma.message.findMany(),
  },
  Mutation: {
    addMessage: (p, args, context) => {
      const message = context.prisma.message.create({
        data: {
          author: args.author,
          text: args.text,
        },
      });
      return message;
    },
  },
};

module.exports = { resolvers };
