import { useEffect, useState } from 'react';
import { GET_LAP_HISTORY } from '../graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { TEAMS } from '../constants';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@mui/material';

export default function LapTimes({ session_uid }) {
  const [laps, setLaps] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [colors, setColors] = useState({});
  const [numTicks, setNumTicks] = useState(5);
  const [opacity, setOpacity] = useState(null);
  const [showDriver, setShowDriver] = useState(null);

  const sortLaps = (a, b) => {
    if (a.lap_num > b.lap_num) {
      return 1;
    } else if (a.lap_num < b.lap_num) {
      return -1;
    } else {
      return 0;
    }
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

  const [getLapHistory] = useLazyQuery(GET_LAP_HISTORY, {
    onCompleted: (laps) => {
      if (laps?.getLapHistory.length > 0) {
        const lapNumbers = [...new Set(laps.getLapHistory.map(i => i.lap_num))];
        const drivers = [...new Set(laps.getLapHistory.map(i => i.name))];
        const colors = {};
        laps.getLapHistory.map(i => {
          colors[i.name] = TEAMS[i.team_id].color
        });
        setColors(colors);
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
        }).sort(sortLaps));
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (session_uid) {
      getLapHistory({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
  }, [session_uid]);

  useEffect(() => {
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

  return (
    <>
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
          <XAxis dataKey="lap_num" type="number" tickCount={50} allowDecimals={false} domain={([dataMin, dataMax]) => [0, dataMax]} />
          <YAxis 
            domain={([dataMin, dataMax]) => { 
              const minValue = Math.floor(dataMin/ 1000) * 1000;
              const maxValue = Math.ceil(dataMax/1000) * 1000;
              if ((maxValue - minValue)/1000 + 1 !== numTicks) setNumTicks((maxValue - minValue)/1000 + 1);
              return [minValue, maxValue] 
            }} 
            tickFormatter={timeScale}
            tickCount={numTicks}
          />
          <Tooltip content={<CustomToolTip />} />
          <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} />
          <Button>
            Hi
          </Button>
          { showDriver && drivers.map((d, i) => {
            return (
              <Line type="linear" dataKey={d} stroke={colors[d]} strokeWidth={3} strokeOpacity={opacity[d]} hide={showDriver[d]} activeDot={{ r: 8 }} connectNulls={false} />
            )
          })}
        </LineChart>
      )}
    </>
  )
}