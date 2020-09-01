const { prismaVersion } = require("@prisma/client");

require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUserId = (context) => {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    return userId;
  }
  throw new Error("Not authenticated!");
};

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
    feed: async (p, args, context) =>
      await context.prisma.message.findMany({
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
      }),
    users: async (p, args, context) => {
      return await context.prisma.user.findMany({
        skip: args.skip,
        take: args.take,
      });
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const password = await bcrypt.hash(args.password, 10);
      const user = await context.prisma.user.create({
        data: { ...args, password },
      });
      const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

      return {
        user,
        token,
      };
    },
    login: async (parent, args, context, info) => {
      const user = context.prisma.user.findOne({
        where: { email: args.email },
      });

      if (!user) {
        throw new Error("No such user found");
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET);

      return {
        token,
        user,
      };
    },
    addMessage: (p, args, context) => {
      const userId = getUserId(context);
      const message = context.prisma.message.create({
        data: {
          text: args.text,
          postedBy: { connect: { id: userId } },
        },
      });

      context.pubsub.publish("NEW_MESSAGE", message);
      return message;
    },
  },
  Subscription: {
    newMessage,
  },
  User: {
    messages: (p, a, c) => {
      return c.prisma.user.findOne({ where: { id: p.id } }).messages();
    },
  },
  Message: {
    postedBy: (p, a, c) => {
      return c.prisma.message.findOne({ where: { id: p.id } }).postedBy();
    },
  },
};

module.exports = { resolvers };
