import * as React from 'react';
import Select from "@mui/material/Select";
import { useLazyQuery } from '@apollo/client';
import { GET_LAP_HISTORY, SESSIONS, USERS } from '../graphql/queries';
import { Box, MenuItem } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { DataGrid } from '@mui/x-data-grid';
import { ERAS, GAME_MODES, RULESETS, TRACKS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SessionSelect() {
  const [users, setUsers] = React.useState([]);
  const [sessions, setSessions] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedSession, setSelectedSession] = React.useState([]);
  const [session, setSession] = React.useState("");
  const [laps, setLaps] = React.useState([]);
  const [drivers, setDrivers] = React.useState([]);
  const [opacity, setOpacity] = React.useState(null);
  const [showDriver, setShowDriver] = React.useState(null);
  const [numTicks, setNumTicks] = React.useState(5);

  const colors = ['#00D2BE', '#DC0000', '#0600EF', '#005AFF', '#006F62', '#0090FF', '#2B4562', '#FF8700', '#900000', '#fcd56d', '#006F62', '#fcd56d', '#B4B3B4', '#EBC110', '#243EF6', 
  '#84020A', '#0ED4FA', '#181e2a', '#F7401A', '#ff2b08', '#0E1185', '#ff88d3', '#FBEC20', '#E80309', '#E8E8E8'];
  const [getSessions, { testsLoading, testsError, testsData }] = useLazyQuery(SESSIONS, {
    onCompleted: (sessions) => {
      if (sessions?.sessions.length > 0) {
        setSessions(sessions.sessions);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [getUsers, { usersLoading, usersError, usersData }] = useLazyQuery(USERS, {
    onCompleted: (users) => {
      if (users?.users.length > 0) {
        setUsers(users.users);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [getLapHistory, { lapsLoading, lapsError, lapsData }] = useLazyQuery(GET_LAP_HISTORY, {
    onCompleted: (laps) => {
      if (laps?.getLapHistory.length > 0) {
        const lapNumbers = [...new Set(laps.getLapHistory.map(i => i.lap_num))];
        const drivers = [...new Set(laps.getLapHistory.map(i => i.name))];
        setDrivers(drivers);
        setLaps(lapNumbers.map(l => {
          let data = {
            lap_num: l
          };
          drivers.map(d => {
            const lap = laps.getLapHistory.filter(l1 => l1.name === d && l1.lap_num === l);
            if (lap.length > 0) {
              data[d] = lap[0].lap_time;
            }
          });
          return data;
        }));
        // setLaps(drivers.map(d => {
        //   return laps.getLapHistory.filter(l => l.name === d);
        // }));
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  React.useEffect(() => {
    getUsers();
  }, []);
  React.useEffect(() => {
    if (selectedUser?.id) {
      getSessions({
        variables: {
          username: selectedUser.id
        }
      });
    }
  }, [selectedUser]);
  React.useEffect(() => {
    if (selectedSession.length > 0) {
      setSession(selectedSession[0]);
    }
  }, [selectedSession]);
  React.useEffect(() => {
    if (session) {
      getLapHistory({
        variables: {
          username: selectedUser.id,
          session_uid: session
        }
      })
    }
  }, [session]);

  React.useEffect(() => {
    if (laps.length > 0) console.log(laps);
  }, [laps]);

  React.useEffect(() => {
    if (drivers.length > 0) {
      const opacities = {};
      const showDrivers = {};
      drivers.map(d => {
        opacities[d] = 1;
        showDrivers[d] = false;
      });
      setOpacity(opacities);
      setShowDriver(showDrivers);
    }
  }, [drivers]);
  
  React.useEffect(() => {
    console.log(numTicks);
  }, [numTicks]);

  const handleChangeUser = (event) => {
    setSelectedUser(event.target.value);
  }

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.5});
  }

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1});
  }

  const handleClick = (o) => {
    const { dataKey } = o;
    setShowDriver({ ...showDriver, [dataKey]: !showDriver[dataKey]});
  }

  const timeScale = x => {
    const ms = ('000' + x % 1000).slice(-3);
    let seconds = Math.floor(x / 1000);
    const min = Math.floor(seconds / 60);
    seconds -= min * 60;
    seconds = ('00' + seconds).slice(-2);
    return `${min}:${seconds}.${ms}`;
  }

  const CustomToolTip = props => {
    const { active, payload, label } = props;
    if (!active || !payload) {
      return null;
    }
    return (
      <div
        className="custom-tooltip"
      >
        <p>
          <strong>{label}</strong>
        </p>
        {payload.map((item, i) => (
          <p key={i}>
            {item.name}: <strong>{timeScale(item.value)}</strong>
          </p>
        ))}
      </div>
    );
  };

  const columns = [
    { field: "uid", headerName: "Session ID", width: 220},
    { field: "network_game", headerName: "Online?", width: 100, valueGetter: ({ value }) => value ? "Yes" : "No"},
    { field: "track_id", headerName: "Track", width: 300, valueGetter: ({ value }) => TRACKS[value]?.name},
    { field: "formula", headerName: "Car Type", width: 200, valueGetter: ({ value }) => ERAS[value]},
    { field: "gamemode", headerName: "Game Mode", width: 200, valueGetter: ({ value }) => GAME_MODES[value]},
    { field: "ruleset", headerName: "Ruleset", width: 200, valueGetter: ({ value }) => RULESETS[value]},
    { field: "created_at", headerName: "Created At", width: 200, type: "dateTime", valueGetter: ({ value }) => value && new Date(value)}
  ];

  return (
    <>
      <Select
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
      </Select>
      { selectedUser?.id && (
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
        />
      )}
      { laps.length > 0 && (
        <LineChart
          width={1000}
          height={800}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          data={laps}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lap_num" type="number" />
          <YAxis 
            domain={([dataMin, dataMax]) => { 
              const minValue = Math.floor((dataMin - 1000)/ 1000) * 1000;
              const maxValue = Math.ceil((dataMax + 1000)/1000) * 1000;
              if ((maxValue - minValue)/1000 + 1 !== numTicks) setNumTicks((maxValue - minValue)/1000 + 1);
              return [minValue, maxValue] 
            }} 
            tickFormatter={timeScale}
            tickCount={numTicks}
          />
          <Tooltip content={<CustomToolTip />} />
          <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} />
          { showDriver && drivers.map((d, i) => {
            return (
              <Line type="monotone" dataKey={d} stroke={colors[i]} strokeWidth={3} strokeOpacity={opacity[d]} hide={showDriver[d]} activeDot={{ r: 8 }} />
            )
          })}
          
        </LineChart>
      )}
    </>
  )
}