import { gql } from "@apollo/client";

const UPDATE_NAME = gql`
  mutation updateName($uid: String!, $username: UInt!, $name: String) {
    updateName(uid: $uid, username: $username, name: $name)
  }
`;

export {
  UPDATE_NAME
}