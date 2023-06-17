import { gql } from "@apollo/client";
const SESSIONS = gql`
  query sessions($username: UInt!) {
    sessions(username: $username) {
      uid
      username
      created_at
      track_id
      formula
      network_game
      gamemode
      ruleset
    }
  }
`;

const USERS = gql`
  query users {
    users {
      id
      username
    }
  }
`;

const GET_LAP_HISTORY = gql`
  query getLapHistory($username: UInt!, $session_uid: String!) {
    getLapHistory(username: $username, session_uid: $session_uid) {
      lap_num
      lap_time
      name
    }
  }
`;

export {
  SESSIONS,
  USERS,
  GET_LAP_HISTORY
};