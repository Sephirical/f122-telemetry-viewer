import { useEffect, useState } from 'react';
import { PARTICIPANTS } from '../graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { NATIONALITIES, TEAMS } from '../constants';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';

export default function Overtakes({ session_uid }) {
  const [drivers, setDrivers] = useState([]);
  const [getParticipants] = useLazyQuery(PARTICIPANTS, {
    onCompleted: (participants) => {
      if (participants?.participants.length > 0) {
        setDrivers(participants.participants);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (session_uid) {
      getParticipants({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      })
    }
    
  }, [session_uid]);

  const columns = [
    { field: "index", headerName: "Vehicle Index", flex: 1},
    { field: "name", headerName: "Name", flex: 1},
    { field: "team_id", headerName: "Team", flex: 1, valueGetter: ({ value }) => TEAMS[value]?.name},
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
        <DataGrid
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
      )}
    </>
  )
}