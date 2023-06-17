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
      name
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

const GET_TYRE_STINTS = gql`
  query getTyreStints($username: UInt!, $session_uid: String!) {
    getTyreStints(username: $username, session_uid: $session_uid) {
      name
      stint
      visual
      stint_length
    }
  }
`;

export {
  SESSIONS,
  USERS,
  GET_LAP_HISTORY,
  GET_TYRE_STINTS
};