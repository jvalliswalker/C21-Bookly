const { Book, User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log("context", context);
      if (context.user) {
        return User.findById(args.user._id);
      }
      throw new AuthenticationError("You need to be logged in");
    },
    users: async () => {
      return await User.find().populate("savedBooks");
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      console.log("args", args);

      const user = await User.create({
        username,
        email,
        password,
      });

      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      console.log("email", email);
      console.log("password", password);

      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      console.log("args", args);
      console.log("context", context);

      const user = await User.findById(context.user._id).populate("savedBooks");

      if (!user) {
        throw new AuthenticationError("You need to be logged in");
      }

      user.savedBooks.push(args.book);

      return user;
    },
    removeBook: async (parent, args, context) => {
      console.log("args", args);
      console.log("context", context);

      const user = await User.findById(context.user._id).populate("savedBooks");

      if (!user) {
        throw new AuthenticationError("You need to be logged in");
      }

      const book = await Book.findOne({ bookId: args.bookId });

      const response = await user.savedBooks.id(book._id).deleteOne();

      if (!response.ok) {
        throw new Exception("delete failed");
      }

      return user;
    },
  },
};

module.exports = { resolvers };
