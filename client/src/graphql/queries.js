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
      session_type
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
      team_id
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

const FIND_USER = gql`
  query findUser {
    findUser {
      id
      username
    }
  }
`;

const PARTICIPANTS = gql`
  query participants($username: UInt!, $session_uid: String!) {
    participants(username: $username, session_uid: $session_uid) {
      index
      is_ai
      driver_id
      team_id
      is_my_team
      race_number
      nationality
      name
      telemetry
      show_name
    }
  }
`;

const FINAL_CLASSIFICATIONS = gql`
  query finalClassifications($username: UInt!, $session_uid: String!) {
    finalClassifications(username: $username, session_uid: $session_uid) {
      index
      name
      team_id
      position
      num_laps
      grid_position
      num_pitstops
      best_laptime
      total_racetime
      penalties_time
      num_penalties
      result_status
    }
  }
`;

const OOR_FINAL_CLASSIFICATIONS = gql`
  query oorFinalClassifications($username: UInt!, $session_uid: String!) {
    oorFinalClassifications(username: $username, session_uid: $session_uid) {
      index
      name
      team
      position
      num_laps
      grid_position
      num_pitstops
      result_status
      best_laptime
      total_racetime
      penalties_time
      num_penalties
      num_tyrestints
    }
  }
`;

export {
  SESSIONS,
  USERS,
  GET_LAP_HISTORY,
  GET_TYRE_STINTS,
  FIND_USER,
  PARTICIPANTS,
  FINAL_CLASSIFICATIONS,
  OOR_FINAL_CLASSIFICATIONS
};