let messages = [{ author: "a", id: 1, timeStamp: 0, text: "0" }];

let id = 2;

const resolvers = {
  Query: {
    hello: () => "Hello World!",
    feed: () => messages,
  },
  Mutation: {
    addMessage: (p, args) => {
      const new_message = {
        id: id++,
        author: args.author,
        text: args.text,
        timeStamp: args.timeStamp,
      };
      messages = [new_message, ...messages];
      return new_message;
    },
  },
};

module.exports = { resolvers };
