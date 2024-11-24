import { gql } from "@apollo/client";

const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        description
        title
        bookId
        authors
      }
    }
  }
`;

export { GET_ME };
