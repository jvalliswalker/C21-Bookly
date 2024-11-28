const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim(); // splitting on "Bearer ABCXYZ"
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(
        // Confirm token not modified  and decodes successfully with passed secret/expiration
        token,
        secret, // secret from above
        { maxAge: expiration } // from above
      );
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration }); // jwt.sign = generate token (encrypting the data, usually base64)
  },
};
