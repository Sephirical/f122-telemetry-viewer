import { useEffect, useState } from 'react';
import { FASTEST_SPEED_TRAPS } from '../graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { DataGrid } from '@mui/x-data-grid';

export default function SpeedTrap({ session_uid }) {
  const [speeds, setSpeeds] = useState([]);
  const [fastestSpeedTraps] = useLazyQuery(FASTEST_SPEED_TRAPS, {
    onCompleted: (speedtrap) => {
      if (speedtrap?.fastestSpeedTraps.length > 0) {
        setSpeeds(speedtrap.fastestSpeedTraps.map((s, i) => {
          return {
            id: i,
            name: s.name,
            speed: s.speed
          }
        }))
      }
    }
  });

  useEffect(() => {
    if (session_uid) {
      fastestSpeedTraps({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
    
  }, [session_uid]);
  
  const columns = [
    { field: "id", headerName: "id", flex: 1},
    { field: "name", headerName: "Name", flex: 1},
    { field: "speed", headerName: "Speed", flex: 1},
  ];
  
  return (
    <>
      {speeds.length > 0 && (
        <DataGrid
          columns={columns} 
          rows={speeds}
          isRowSelectable={() => false}
          columnVisibilityModel={{
            id: false
          }}
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