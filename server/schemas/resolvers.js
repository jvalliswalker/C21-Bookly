const { Book, User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id).populate("savedBooks");
      }
      throw AuthenticationError;
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
      console.log("context.user", context.user);

      const user = await User.findById(context.user._id).populate("savedBooks");

      if (!user) {
        throw new AuthenticationError("You need to be logged in");
      }

      user.savedBooks.push(args.book);
      await user.save();

      return user;
    },
    removeBook: async (parent, args, context) => {
      const user = await User.findById(context.user._id).populate("savedBooks");

      if (!user) {
        throw new AuthenticationError("You need to be logged in");
      }

      let bookIdToRemove;

      for (const book of user.savedBooks) {
        if (book.bookId == args.bookId) {
          bookIdToRemove = book._id;
          break;
        }
      }
      console.log("bookIdToRemove", bookIdToRemove);

      const response = await user.savedBooks.id(bookIdToRemove).deleteOne();

      await user.save();

      return user;
    },
  },
};

module.exports = { resolvers };
