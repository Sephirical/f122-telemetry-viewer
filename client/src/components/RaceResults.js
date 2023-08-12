import { useEffect, useState } from 'react';
import { FINAL_CLASSIFICATIONS, OOR_FINAL_CLASSIFICATIONS } from '../graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { TEAMS } from '../constants';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import { parse } from "csv-parse/browser/esm/sync";
import { CREATE_FINAL_CLASSIFICATIONS } from '../graphql/mutations';

export default function RaceResults({ session_uid, session_type }) {
  const [results, setResults] = useState([]);
  const [oorResults, setOorResults] = useState([]);
  const [fastestLap, setFastestLap] = useState(-1);
  const [csv, setCsv] = useState("");
  const [uploadedCsv, setUploadedCsv] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [getFinalClassifications] = useLazyQuery(FINAL_CLASSIFICATIONS, {
    onCompleted: (classifications) => {
      if (classifications?.finalClassifications.length > 0) {
        setResults(classifications.finalClassifications);
        const fastestLaps = classifications.finalClassifications.map(c => c.best_laptime );
        if ([10, 11, 12].includes(session_type)) fastestLaps.sort();
        for (let i = 0; i < fastestLaps.length; i++) {
          if (fastestLaps[i] > 0) {
            setFastestLap(fastestLaps[i]);
            break;
          }
        }
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [getOORFinalClassifications] = useLazyQuery(OOR_FINAL_CLASSIFICATIONS, {
    onCompleted: (classifications) => {
      if (classifications?.oorFinalClassifications.length > 0) {
        setOorResults(classifications.oorFinalClassifications);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [createFinalClassifications] = useMutation(CREATE_FINAL_CLASSIFICATIONS);
  const gridApiRef = useGridApiRef();

  const handleFileUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setUploadedCsv(name);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
      const { result } = evt.target;
      const records = parse(result, {
        columns: ["index", "position", "grid_position", "result_status"],
        delimiter: ",",
        trim: true,
        skip_empty_lines: true
      });
      const modRecords = records.map(r => {
        return {
          index: Number(r.index),
          position: Number(r.position),
          grid_position: Number(r.grid_position),
          result_status: Number(r.result_status)
        }
      });
      setCsvData(modRecords);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (session_uid) {
      getFinalClassifications({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
      getOORFinalClassifications({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
    
  }, [session_uid]);

  useEffect(() => {
    if (oorResults.length > 0) {
      let csvRows = [];
      const headers = Object.keys(oorResults[0]);
  
      // As for making csv format, headers must
      // be separated by comma and pushing it
      // into array
      csvRows.push(headers.join(','));
    
      // Pushing Object values into array
      // with comma separation
      oorResults.map(r => {
        // let values = Object.values(r);
        
        const values = Object.values(r).join(',');
        csvRows.push(values);
      });
    
      // Returning the array joining with new line 
      setCsv(csvRows.join('\n'));
    }
  });

  useEffect(() => {
    if (csvData.length > 0) {
      createFinalClassifications({
        variables: {
          input: {
            session_uid,
            username: Number(localStorage.getItem("id")),
            classifications: csvData.slice(1)
          }
        }
      })
    }
  }, [csvData]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
  
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `${session_uid} Race Result.csv`;
    link.href = url;
    link.click();
  }
  
  const columns = [
    { field: "position", headerName: "Finish Position", flex: 1},
    { field: "name", headerName: "Name", flex: 2},
    { field: "team_id", headerName: "Team", flex: 2, valueGetter: ({ value }) => TEAMS[value]?.name},
    { field: "grid_position", headerName: "Starting Position", flex: 1},
    { field: "num_laps", headerName: "Laps", flex: 1},
    { field: "num_pitstops", headerName: "# Of Pitstops", flex: 1},
    { 
      field: "best_laptime", 
      headerName: "Best Lap Time",
      flex: 1, 
      renderCell: ({ value }) => { 
        if (!value) return "-:--:--";
        const ms = ("000" + value % 1000).slice(-3);
        const sec = ("00" + Math.floor((value / 1000) % 60)).slice(-2);
        const min = Math.floor(value / 60000);
        return <Typography color={value === fastestLap ? "#8d589e" : "#000000"} fontSize="0.875rem">
          {`${min}:${sec}.${ms}`}
        </Typography>;
      }
    },
    {
      field: "interval",
      headerName: "Interval",
      flex: 1,
      valueGetter: (params) => {
        if (params.row.position === 1) {
          return "";
        } else {
          if (params.row.result_status === 4) {
            return "DNF";
          } else if (params.row.result_status === 5) {
            return "DSQ";
          } else {
            const leader = results[0];
            const interval = params.row.best_laptime - leader.best_laptime;
            const ms = ("000" + interval % 1000).slice(-3);
            const sec = ("00" + Math.floor((interval / 1000) % 60)).slice(-2);
            const min = Math.floor(interval / 60000);
            return `+${min > 0 ? min + ":" + sec : Number(sec)}.${ms}`;
          }
        }
      }
    },
    { 
      field: "total_racetime", 
      headerName: "Race Time", 
      flex: 1, 
      valueGetter: (params) => {
        if (!params.value) return "N/A";
        if (params.row.position === 1) {
          const timeSplit = (params.value + params.row.penalties_time).toString().split("."); 
          const ms = ("000" + timeSplit[1]).slice(-3);
          const sec = ("00" + Number(timeSplit[0]) % 60).slice(-2);
          const min = Math.floor(Number(timeSplit[0] / 60));
          return `${min}:${sec}.${ms}`;
        } else {
          const leader = results[0];
          if (params.row.result_status === 4) {
            return "DNF";
          } else if (params.row.result_status === 5) {
            return "DSQ";
          } else if (params.row.num_laps < leader.num_laps) {
            const lap_diff = leader.num_laps - params.row.num_laps;
            return `+${lap_diff} Lap${lap_diff > 1 ? 's' : ''}`;
          } else {
            const timeSplit = (params.value + params.row.penalties_time - leader.total_racetime - leader.penalties_time).toFixed(3).split(".");
            const ms = ("000" + timeSplit[1]).slice(-3);
            const sec = ("00" + Number(timeSplit[0]) % 60).slice(-2);
            const min = Math.floor(Number(timeSplit[0] / 60));
            return `+${min > 0 ? min + ":" + sec : Number(timeSplit[0]) % 60}.${ms}`;
          }
        }
      }
    },
    { field: "num_penalties", headerName: "# Of Penalties", flex: 1},
    { field: "penalties_time", headerName: "Penalty Time Added", flex: 1}
  ];
  
  return (
    <>
      {csv && (
        <Button variant="contained" onClick={downloadCSV} sx={{mb: 2}}>
          Download CSV
        </Button>
      )}
      {results.length == 0 && (
        <>
          <input
            accept=".csv"
            style={{ display: "none" }}
            id="uploadresult"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="uploadresult">
            <Button variant="contained" component="span">
              Upload Race Result
            </Button>
          </label>
        </> 
      )}
      {results.length > 0 && (
        <DataGrid
          apiRef={gridApiRef}
          columns={columns} 
          rows={results} 
          getRowId={({ position }) => position}
          isRowSelectable={() => false}
          columnVisibilityModel={{
            grid_position: [10, 11, 12].includes(session_type),
            num_laps: [10, 11, 12].includes(session_type),
            num_pitstops: [10, 11, 12].includes(session_type),
            total_racetime: [10, 11, 12].includes(session_type),
            num_penalties: [10, 11, 12].includes(session_type),
            penalties_time: [10, 11, 12].includes(session_type),
            interval: ![10, 11, 12].includes(session_type)
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