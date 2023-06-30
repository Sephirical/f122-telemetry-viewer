import { gql } from "@apollo/client";

const UPDATE_NAME = gql`
  mutation updateName($uid: String!, $username: UInt!, $name: String) {
    updateName(uid: $uid, username: $username, name: $name)
  }
`;

const CREATE_FINAL_CLASSIFICATIONS = gql`
  mutation createFinalClassifications($input: CreateFinalClassificationInput) {
    createFinalClassifications(input: $input)
  }
`;

export {
  UPDATE_NAME,
  CREATE_FINAL_CLASSIFICATIONS
}