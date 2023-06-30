import { useEffect, useState, useCallback, useMemo } from 'react';
import Select from "@mui/material/Select";
import { useLazyQuery, useMutation } from '@apollo/client';
import { FIND_USER, GET_LAP_HISTORY, GET_TYRE_STINTS, SESSIONS, USERS } from '../graphql/queries';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
import { ERAS, GAME_MODES, RULESETS, SESSION_TYPES, TRACKS, TYRES } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { UPDATE_NAME } from '../graphql/mutations';
import { useSearchParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Participants from '../components/Participants';
import RaceResults from '../components/RaceResults';
import LapTimes from '../components/LapTimes';
import TyreStints from '../components/TyreStints';

function EditToolbar(props) {
  const { selectedCellParams, cellMode, cellModesModel, setCellModesModel } = props;

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
      });
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
      });
    }
  };

  const handleCancel = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    });
  };

  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        p: 1,
      }}
    >
      <Button
        onClick={handleSaveOrEdit}
        onMouseDown={handleMouseDown}
        disabled={!selectedCellParams}
        variant="outlined"
      >
        {cellMode === 'edit' ? 'Save' : 'Edit'}
      </Button>
      <Button
        onClick={handleCancel}
        onMouseDown={handleMouseDown}
        disabled={cellMode === 'view'}
        variant="outlined"
        sx={{ ml: 1 }}
      >
        Cancel
      </Button>
    </Box>
  );
}

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

  const columns = [
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
            setSelectedSession(newSelectionModel)
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
                <Participants session_uid={session} />
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
                <RaceResults session_uid={session} />
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
          </>
        )
      }
    </>
  )
}