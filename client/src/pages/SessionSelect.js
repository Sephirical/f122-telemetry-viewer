import { useEffect, useState, useCallback, useMemo } from 'react';
import Select from "@mui/material/Select";
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_USER, GET_LAP_HISTORY, GET_TYRE_STINTS, SESSIONS, USERS } from '../graphql/queries';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Switch, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
import { ERAS, GAME_MODES, RULESETS, SESSION_TYPES, TRACKS, TYRES } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TOGGLE_OOR, UPDATE_NAME } from '../graphql/mutations';
import { useSearchParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Participants from '../components/Participants';
import RaceResults from '../components/RaceResults';
import LapTimes from '../components/LapTimes';
import TyreStints from '../components/TyreStints';
import EditToolbar from '../components/EditToolbar';
import SpeedTrap from '../components/SpeedTrap';



export default function SessionSelect() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState([]);
  const [session, setSession] = useState("");
  const [selectedCellParams, setSelectedCellParams] = useState(null);
  const [cellModesModel, setCellModesModel] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const auth_code = searchParams.get("code");
    var details = {
      "grant_type":"authorization_code",
      "client_id":"1l3tetgbv55on65v5esrqtu9hu",
      "code": auth_code,
      "redirect_uri":"https://f1telemetryviewer.com/sessions",
      "client_secret": "bmr0t21ie2mcvbhm90q9datul42ji5ath1bpl2hli7qg9mvhakc"
    };
  
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    fetch(`https://f1-telemetry-user.auth.ap-southeast-2.amazoncognito.com/oauth2/token`, {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type":'application/x-www-form-urlencoded'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      if (json?.access_token) {
        localStorage.setItem("token", json.access_token);
      }
      if (localStorage.getItem("token")) {
        findUser();
      }
    });

    // const token = "eyJraWQiOiJhMzQ3YTFjZS0yZTNlLTRiNzMtYjBhZC03NmI1YWUxYzdjYzMiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhY2NvdW50cy5lYS5jb20iLCJqdGkiOiJTa0V3T2pNdU1Eb3hMakE2TjJJME9EWXlaVGd0TldKbU9TMDBNamhpTFdGaU5qa3RabVkxWkRSa056VTRaV015IiwiYXpwIjoiUkFDRU5FVF8xX0pTX1dFQl9BUFAiLCJpYXQiOjE2OTAyNzA3OTEsImV4cCI6MTY5MDI4NTE5MSwidmVyIjoxLCJuZXh1cyI6eyJyc3ZkIjp7ImVmcGx0eSI6IjEzIn0sImNsaSI6IlJBQ0VORVRfMV9KU19XRUJfQVBQIiwicHJkIjoiZWJiZTIwOTEtZTkxZi03ZmZkLTI3ZjEtYTc3ZDJkM2RhOTI1Iiwic2NvIjoib2ZmbGluZSBzZWN1cml0eS50d29mYWN0b3Igc2lnbmluIGRwLmNvbW1lcmNlLmNsaWVudC5kZWZhdWx0IGRwLmlkZW50aXR5LmNsaWVudC5kZWZhdWx0IGRwLnByb2dyZXNzaW9uLmNsaWVudC5kZWZhdWx0IGRwLmZpcnN0cGFydHljb21tZXJjZS5jbGllbnQuZGVmYXVsdCIsInBpZCI6IjEwMDE5Mzg3MTYzNTEiLCJwdHkiOiJOVUNMRVVTIiwidWlkIjoiMTAwMTkzODcxNjM1MSIsImR2aWQiOiIwMjgzZDRlZi1hZGI5LTRlN2ItODE5YS1kNWUzZmI1NjMzNWEiLCJwbHR5cCI6IldFQiIsInBuaWQiOiJFQSIsImRwaWQiOiJXRUIiLCJzdHBzIjoiT0ZGIiwidWRnIjpmYWxzZSwiY250eSI6IjEiLCJhdXNyYyI6IlJBQ0VORVRfMV9KU19XRUJfQVBQIiwiaXBnZW8iOnsiaXAiOiIxMjEuOTkuKi4qIiwiY3R5IjoiTloiLCJyZWciOiJBdWNrbGFuZCIsImNpdCI6IkF1Y2tsYW5kIiwiaXNwIjoiMmRlZ3JlZXMiLCJsYXQiOiItMzYuODUwNiIsImxndCI6IjE3NC43Njc5IiwidHoiOiIxMiJ9LCJ1aWYiOnsidWRnIjpmYWxzZSwiY3R5IjoiQVUiLCJsYW4iOiJlbiIsInN0YSI6IkFDVElWRSIsImFubyI6ZmFsc2UsImFnZSI6MzMsImFncCI6IkFEVUxUIn0sInBzaWYiOlt7ImlkIjoxNDU5Mjg2NTEzLCJucyI6ImNlbV9lYV9pZCIsImRpcyI6IlNlcGhpcmljYWxQYW5kYSIsIm5pYyI6IlNlcGhpcmljYWwifV0sImVuYyI6IjByelhoNXRNRjIxUThFMUJnUHZWS1BOUlZaeHRtYjMraE1BMTZLK0xidk9obFI3RDZWcEFhWC8rTGcwb0twZUdvZVFqRmF2TEdvTENRazROUUpCR3NFUEFkaXhLam1QNVJJOUFKbVhvNTUrZ2h3WjlLclE3dm9pcXEvaGlBM1Z3ekVpakNZRkF0M3kvNXZGZFFKemttbzZ1c244aDlweFRHdUN5a2Jra1R3Z0V5dmplbzhJanhSalI2SHlPOFdmMEF6ZzNDaXQ2TDhJVUlRMDVGZDNJUE5wL3dzd0Z3MXYvaU5McmZ4RFd5TjRPemhGM3FYVU8zUGJRMk1xdk1vSUo1RUFJSXhjUzFRaTdpVWROYUxSOUdpa2ZhM2JENERhMnIvcXdsYVYzWGNCTkNaNGdOc0JuRVhrVHlRanhlQVFZYzFJY1pKSnBpY28wbmVhK3VVbHBvQTJRR2EyOFovTFdYd2hyckg1VHBNZ2VIYnVnd2x2NHJ5Rk5rRUtBSHllRDJqWkVpWFdwMEVzbFRyZituZkNjdVpTZlR3WE5rQ2lCZFhuMDhmTDVwU0xWN2xtYjVJUEljaWhJOUlYUDRrVExpbEtvcktPVWF6WTdqdzB1ei9LVmVBYXo5Y1dLVnJhWURiTVJkYmtHUG5WYzJXeEkrVHFtcEN5LzVsYjlBMzlJbEhraUhDQ3F2bnlZZFNpazlaRVZqcGlXcHViQ0VDWUFGUGIwaVBEbzhHenZsOENQOEZuMHA4VG1QTjVXZEJscGV5elVyVlNKQkd2SmdSaldudllpVHQzWURiN1ZkSEdIRXptTENZbGMzdWdsTEF6ejNUSzMrUjNwZWJXM1QyaUV6dVI2MUUwcUpyQ0xObWk3V1VXUEZnbWo4QWRKcWl6M0RGNE0rdzdZV09MbFkwWFp4UjZKVTdQdUQxeU9RdjlJVlZGQkFlcjZzR3JONzV1ZUpCK2J6MDZ6dXBHRExiWU5YM2NzYjU1NWdhc3RDSlRtVzBWK2U1ZTJVUmhibFJuME5zQmFpQ2s4QkphQVNDYytIdHFBWmRhRXRxSGE3NU5YVk5WUWlkZTJqbjNQeVVtc1Q2VC9EYnY0MElDUUJQZnZWVFVjMmJKYm5uWGkxTFU0NXBhc0QwUmhqK0hqZCsrd2EycHk1Sk1uSUh5bnpidEpxTUlNVHVyNVMwUXhPb0htZm1HaUxxV284c3Yrdkczd1Iva2pnNmRaZlExZWwzeHltc0Rmc1A2NWxNU0VmUEhzR2M0STd0ZDZmbVBPanNqQ2NqNWVvaTdBWjNBUEdRWEpMNnNJZ2c9PSJ9fQ.JR8Gp9dr4N8rxyNKoo5pJgTfT2qkKHzPSiPU7o2f0r7WDInixoZg4dDrx_2PqU3hNsEV8VkKi2iXDiN8UE3FrPe0QhvzP7yXeZI9On84u0CfajB088Pss00lcDg1tuITfThyZBUBGX1zfaKadSgHEszGTQmyFFA3VJdjHuTQtogdUu8SfwdWkxxntNeVVqVMSk6I_fetCjlmHaH2Vxnb8z-Jm_xiXeKxrqCQuaO9XZ5l3cNmVPriefLQF3Cb1GjCC9gtqfslj1xe1jFbQx5e9UqlGnfypQJ3e0iJwkqBd12zRBJnlaAABaatreohEe7Zy5H6-qRAdMLyx_yHuYNohA";

    // fetch("https://web-api.racenet.com/api/F123Stats/leaderboard/14?platform=3&pageNumber=1&mode=00&weather=D&pageSize=20&playerFocus=false&type=0&version=1&isCrossPlay=true", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${token}`
    //   }
    // })
    // .then((response) => response.json())
    // .then((json) => {
    //   console.log(json);
    // });

  }, []);

  const handleCellFocus = useCallback((event) => {
    const row = event.currentTarget.parentElement;
    const id = row.dataset.id;
    const field = event.currentTarget.dataset.field;
    setSelectedCellParams({ id, field });
  }, []);

  const cellMode = useMemo(() => {
    if (!selectedCellParams) {
      return 'view';
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || 'view';
  }, [cellModesModel, selectedCellParams]);

  const handleCellKeyDown = useCallback(
    (params, event) => {
      if (cellMode === 'edit') {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true;
      }
    },
    [cellMode],
  );

  const handleCellEditStop = useCallback((params, event) => {
    event.defaultMuiPrevented = true;
  }, []);

  const [getSessions, { testsLoading, testsError, testsData }] = useLazyQuery(SESSIONS, {
    onCompleted: (sessions) => {
      if (sessions?.sessions.length > 0) {
        setSessions(sessions.sessions);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  // const [getUsers, { usersLoading, usersError, usersData }] = useLazyQuery(USERS, {
  //   onCompleted: (users) => {
  //     if (users?.users.length > 0) {
  //       setUsers(users.users);
  //     }
  //   },
  //   fetchPolicy: 'network-only',
  //   nextFetchPolicy: 'cache-first',
  // });
  
  const [findUser, { userLoading, userError, userData }] = useLazyQuery(FIND_USER, {
    onCompleted: (user) => {
      localStorage.setItem("id", user.findUser.id);
      localStorage.setItem("username", user.findUser.username);
      setSelectedUser(user.findUser);
      getSessions({
        variables: {
          username: user.findUser.id
        }
      });
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [updateName] = useMutation(UPDATE_NAME);
  const [toggleOOR] = useMutation(TOGGLE_OOR, {
    onCompleted: (toggle) => {
      getSessions({
        variables: {
          username: Number(localStorage.getItem("id"))
        }
      });
    }
  });
  // useEffect(() => {
  //   getUsers();
  // }, []);
  // useEffect(() => {
  //   if (selectedUser?.id) {
  //     getSessions({
  //       variables: {
  //         username: selectedUser.id
  //       }
  //     });
  //   }
  // }, [selectedUser]);
  useEffect(() => {
    if (selectedSession.length > 0) {
      setSession(selectedSession[0]);
    }
  }, [selectedSession]);

  const handleChangeUser = (event) => {
    setSelectedUser(event.target.value);
  }

  const handleOORToggle = (event, row) => {
    toggleOOR({
      variables: {
        uid: row.uid,
        username: row.username,
        value: event.target.checked
      }
    })
    // console.log(event.target.checked, row);
  }

  const renderOOR = (params) => {
    return <Switch checked={params.value} onChange={(e) => handleOORToggle(e, params.row)} />;
  }

  const columns = [
    { field: "is_oor", headerName: "OOR Session?", flex: 1, renderCell: renderOOR},
    { field: "uid", headerName: "Session ID", flex: 2},
    { field: "name", headerName: "Name", flex: 2, editable: true},
    { field: "network_game", headerName: "Online?", flex: 1, valueGetter: ({ value }) => value ? "Yes" : "No"},
    { field: "track_id", headerName: "Track", flex: 1, valueGetter: ({ value }) => TRACKS[value]?.name},
    { field: "formula", headerName: "Car Type", flex: 1, valueGetter: ({ value }) => ERAS[value]},
    { field: "gamemode", headerName: "Game Mode", flex: 2, valueGetter: ({ value }) => GAME_MODES[value]},
    { field: "session_type", headerName: "Session Type", flex: 1, valueGetter: ({ value }) => SESSION_TYPES[value].short},
    { field: "created_at", headerName: "Created At", flex: 1, type: "dateTime", valueGetter: ({ value }) => value && new Date(value)}
  ];

  return (
    <>
      {/* <Select
        value={selectedUser}
        onChange={handleChangeUser}
      >
        {users.length > 0 && users.map(u => {
          return (
            <MenuItem
              value={u}
              id={u.id}
            >{u.username}</MenuItem>
          )
        })}
      </Select> */}
      { sessions.length > 0 && (
        <DataGrid
          columns={columns} 
          rows={sessions}
          getRowId={({ uid }) => uid}
          disableMultipleRowSelection={true}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => {
            if (newSelectionModel.length > 0) {
              setSelectedSession([newSelectionModel[1]]);
            } else {
              setSelectedSession(newSelectionModel);
            }            
          }}
          rowSelectionModel={selectedSession}
          onCellKeyDown={handleCellKeyDown}
          cellModesModel={cellModesModel}
          onCellEditStop={handleCellEditStop}
          onCellModesModelChange={(model) => setCellModesModel(model)}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {
              cellMode,
              selectedCellParams,
              setSelectedCellParams,
              cellModesModel,
              setCellModesModel,
            },
            cell: {
              onFocus: handleCellFocus,
            },
          }}
          disableRowSelectionOnClick
          processRowUpdate={(updatedRow, originalRow) => {
            updateName({
              variables: {
                uid: updatedRow.uid,
                username: updatedRow.username,
                name: updatedRow.name
              }
            })
          }}
          onProcessRowUpdateError={(error) => console.error(error)}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          sx={{ mb: 5 }}
        />
      )}
      {
        session && (
          <>
            <Typography variant="h6">Session Details</Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="participants-content"
                id="participants-header"
              >
                <Typography>Participants</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Participants session_uid={session} is_oor={sessions.find(s => s.uid === session).is_oor} network_game={sessions.find(s => s.uid === session).network_game} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="classifications-content"
                id="classifications-header"
              >
                <Typography>Race Results</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RaceResults session_uid={session} session_type={sessions.find(s => s.uid === session).session_type} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="laphistory-content"
                id="laphistory-header"
              >
                <Typography>Lap History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <LapTimes session_uid={session} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="tyrestints-content"
                id="tyrestints-header"
              >
                <Typography>Tyre Stints</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TyreStints session_uid={session} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="speedtrap-content"
                id="speedtrap-header"
              >
                <Typography>Speed Trap</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SpeedTrap session_uid={session} />
              </AccordionDetails>
            </Accordion>
          </>
        )
      }
    </>
  )
}