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

const UPDATE_PLAYER_NAME = gql`
  mutation updateName($uid: String!, $username: UInt!, $index: Int!, $name: String) {
    updateName(uid: $uid, username: $username, index: $index, name: $name)
  }
`;

const TOGGLE_OOR = gql`
  mutation toggleOOR($uid: String!, $username: UInt!, $value: Boolean!) {
    toggleOOR(uid: $uid, username: $username, value: $value)
  }
`;

const SET_DRIVER_NAMES = gql`
  mutation setDriverNames($session_uid: String!, $username: UInt!) {
    setDriverNames(session_uid: $session_uid, username: $username)
  }
`;

const CREATE_DRIVER = gql`
  mutation createDriver($name: String!) {
    createDriver(name: $name)
  }
`;

const SET_ALIAS = gql`
  mutation setAlias($session_uid: String!, $username: UInt!, $index: Int!, $driver_id: UInt!) {
    setAlias(session_uid: $session_uid, username: $username, index: $index, driver_id: $driver_id)
  }
`;

export {
  UPDATE_NAME,
  CREATE_FINAL_CLASSIFICATIONS,
  UPDATE_PLAYER_NAME,
  TOGGLE_OOR,
  SET_DRIVER_NAMES,
  CREATE_DRIVER,
  SET_ALIAS
}