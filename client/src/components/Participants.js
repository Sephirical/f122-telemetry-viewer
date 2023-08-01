import { useCallback, useEffect, useMemo, useState } from 'react';
import { GET_OOR_DRIVERS, PARTICIPANTS } from '../graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { NATIONALITIES, TEAMS } from '../constants';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import EditToolbar from './EditToolbar';
import { CREATE_DRIVER, SET_ALIAS, SET_DRIVER_NAMES, UPDATE_PLAYER_NAME } from '../graphql/mutations';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { enqueueSnackbar } from 'notistack';

export default function Participants({ session_uid, is_oor }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedCellParams, setSelectedCellParams] = useState(null);
  const [cellModesModel, setCellModesModel] = useState({});
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [pickedDriver, setPickedDriver] = useState(null);
  const [driverList, setDriverList] = useState([]);
  const [index, setIndex] = useState(-1);
  const [getParticipants] = useLazyQuery(PARTICIPANTS, {
    onCompleted: (participants) => {
      if (participants?.participants.length > 0) {
        setDrivers(participants.participants);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const [getOORDrivers] = useLazyQuery(GET_OOR_DRIVERS, {
    onCompleted: (getOORDrivers) => {
      if (getOORDrivers.getOORDrivers.length > 0) {
        setDriverList(getOORDrivers.getOORDrivers);
      }
    }
  });

  const [setDriverNames] = useMutation(SET_DRIVER_NAMES, {
    onCompleted: (driverStatus) => {
      if (driverStatus.setDriverNames > 0) {
        enqueueSnackbar(`${driverStatus.setDriverNames} names have been updated.`, {
          variant: "success"
        });
      } else {
        enqueueSnackbar("No new names have been updated.", {
          variant: "warning"
        });
      }
      getParticipants({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
  });
  const [createDriver] = useMutation(CREATE_DRIVER, {
    onCompleted: (createStatus) => {
      if (createStatus.createDriver) {
        enqueueSnackbar(`New driver ${driverName} successfully created.`, {
          variant: "success"
        });
        getOORDrivers();
      } else {
        enqueueSnackbar(`Driver ${driverName} already exists.`, {
          variant: "warning"
        })
      }
      setDriverName("");
      setShowDriverDialog(false);
    }
  });
  const [setAlias] = useMutation(SET_ALIAS, {
    onCompleted: (aliasStatus) => {
      setPickedDriver(null);
      setShowMatchDialog(false);
      getParticipants({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
  });

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

  const handleDriverClick = () => {
    setDriverNames({
      variables: {
        username: Number(localStorage.getItem("id")),
        session_uid
      }
    })
  };

  const handleAddDriver = () => {
    setShowDriverDialog(true);
  }

  const handleAddDriverCancel = () => {
    setShowDriverDialog(false);
    setDriverName("");
  }

  const handleAddDriverCreate = () => {
    createDriver({
      variables: {
        name: driverName
      }
    });
  }

  const handleShowMatch = (params) => {
    setShowMatchDialog(true);
    setIndex(params.row.index);
  }

  const renderSetDriver = (params) => {
    return (
      <IconButton onClick={() => handleShowMatch(params)}>
        <AddCircleOutlineIcon />
      </IconButton>
    )
  }

  const getPickedDriver = (event, val) => {
    setPickedDriver(val);
  }

  const handleAddAliasCreate = () => {
    setAlias({
      variables: {
        session_uid,
        username: Number(localStorage.getItem("id")),
        index,
        driver_id: pickedDriver.id
      }
    });
  }

  useEffect(() => {
    if (session_uid) {
      getParticipants({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
    if (is_oor) {
      getOORDrivers();
    }
    
  }, [session_uid]);

  const columns = [
    { field: "actions", headerName: "Actions", flex: 1, renderCell: renderSetDriver},
    { field: "index", headerName: "Vehicle Index", flex: 1},
    { field: "name", headerName: "Name", flex: 3, editable: true},
    { field: "team_id", headerName: "Team", flex: 2, valueGetter: ({ value }) => TEAMS[value]?.name},
    { field: "is_ai", headerName: "AI?", flex: 1, renderCell: (params) => {if (params.value) return <DoneIcon />; return <CloseIcon />}},
    { field: "is_my_team", headerName: "MyTeam?", flex: 1, renderCell: (params) => {if (params.value) return <DoneIcon />; return <CloseIcon />}},
    { field: "race_number", headerName: "Race Number", flex: 1},
    { field: "nationality", headerName: "Nationality", flex: 1, valueGetter: ({ value }) => NATIONALITIES[value]},
    { field: "telemetry", headerName: "Sharing Telemetry?", flex: 1, renderCell: (params) => {if (params.value) return <DoneIcon />; return <CloseIcon />}},
    { field: "show_name", headerName: "Sharing Name?", flex: 1, renderCell: (params) => {if (params.value) return <DoneIcon />; return <CloseIcon />}}
  ];
  
  return (
    <>
      {drivers.length > 0 && (
        <>
          {is_oor && (
            <>
              <Dialog open={showMatchDialog} onClose={() => {}} disableEscapeKeyDown maxWidth="lg">
                <DialogTitle>Apply Alias to OOR Driver</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Box
                      component="form"
                      noValidate
                    >
                      <Autocomplete
                        value={pickedDriver}
                        options={driverList}
                        disablePortal
                        renderInput={(params) => <TextField {...params} label="Driver Name" />}
                        getOptionLabel={option => option.name}
                        onChange={getPickedDriver}
                      />
                    </Box>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="text" onClick={handleAddAliasCreate}>Set Driver</Button>
                  <Button variant="text" onClick={/*handleAddDriverCancel*/() => setShowMatchDialog(false)}>Cancel</Button>
                </DialogActions>
              </Dialog>
              <Dialog open={showDriverDialog} disableEscapeKeyDown onClose={() => {}}>
                <DialogTitle>Add New OOR Driver</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Box
                      component="form"
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        required
                        id="name-required"
                        label="Driver Name"
                        value={driverName}
                        onChange={(event) => setDriverName(event.target.value)}
                      />
                    </Box>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button variant="text" onClick={handleAddDriverCreate}>Create Driver</Button>
                  <Button variant="text" onClick={handleAddDriverCancel}>Cancel</Button>
                </DialogActions>
              </Dialog>
              <Button onClick={handleDriverClick} variant="contained" sx={{ mr: 2 }}>
                Fill OOR Driver Names
              </Button>
              <Button onClick={handleAddDriver} variant="contained">
                Add new OOR Driver
              </Button>
            </>
          )}
          <DataGrid
            sx={{ mt: 2 }}
            columnVisibilityModel={{
              actions: is_oor
            }}
            columns={columns} 
            rows={drivers} 
            getRowId={({ index }) => index}
            isRowSelectable={() => false}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 22, page: 0 },
              },
            }}
          />
        </>
      )}
    </>
  )
}