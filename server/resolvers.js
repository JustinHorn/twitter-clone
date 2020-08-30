const { prismaVersion } = require("@prisma/client");

function newMessageSubscription(p, a, context, info) {
  return context.pubsub.asyncIterator("NEW_MESSAGE");
}

const newMessage = {
  subscribe: newMessageSubscription,
  resolve: (payload) => {
    return payload;
  },
};

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
      context.pubsub.publish("NEW_MESSAGE", message);
      return message;
    },
  },
  Subscription: {
    newMessage,
  },
};

module.exports = { resolvers };
