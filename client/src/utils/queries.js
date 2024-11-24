import { gql } from "@apollo/client";

const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      password
    }
  }
`;

export { GET_ME };
