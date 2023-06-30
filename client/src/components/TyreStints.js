import { useEffect, useState } from 'react';
import { GET_TYRE_STINTS, PARTICIPANTS } from '../graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { NATIONALITIES, TEAMS, TYRES } from '../constants';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

export default function TyreStints({ session_uid }) {
  const [stints, setStints] = useState([]);
  const [maxStint, setMaxStint] = useState([]);

  const [getTyreStints] = useLazyQuery(GET_TYRE_STINTS, {
    onCompleted: (tyres) => {
      if (tyres?.getTyreStints.length > 0) {
        let tyreStints = {};
        tyres.getTyreStints.map(t => {
          if (!(t.name in tyreStints)) {
            tyreStints[t.name] = {
              name: t.name
            }
          }
          tyreStints[t.name][t.stint] = {
            stint_length: t.stint_length,
            tyre: t.visual
          }
        });
        setStints(Object.values(tyreStints));
        const maxStintNum = Math.max(...tyres.getTyreStints.map(o => o.stint));
        let stintNum = [];
        for (let i = 0; i <= maxStintNum; i++) {
          stintNum.push(i);
        }
        setMaxStint(stintNum);
      }
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (session_uid) {
      getTyreStints({
        variables: {
          username: Number(localStorage.getItem("id")),
          session_uid
        }
      });
    }
  }, [session_uid]);

  return (
    <>
      { maxStint.length > 0 && (
        <BarChart
          width={1000}
          height={800}
          data={stints}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
          layout="vertical"
          barCategoryGap={25}
        >
          <XAxis type="number" tickCount={50} allowDecimals={false} domain={([dataMin, dataMax]) => [0, dataMax]} />
          <YAxis type="category" dataKey="name" width={200} />
          { maxStint.map(m => (
            <Bar
              isAnimationActive={false}
              dataKey={`${m}.stint_length`}
              fill="#bebebe"
              barSize={100}
              stackId="a"
            >
              {stints.map((s, i) => {
                if (m in s) {
                  const cell = (
                    <Cell 
                      stroke="#000000"
                      strokeWidth={1}
                      fill={TYRES[s[m].tyre].color}
                      key={`${m}-${i}`}
                    />
                  );
                  return (
                    cell
                  );
                } else {
                  return (
                    <Cell 
                      stroke="#000000"
                      strokeWidth={1}
                      fill="#bebebe"
                      key={`${m}-${i}`}
                    />
                  )
                }
              })}
            </Bar>
          ))}
        </BarChart>
      )}
    </>
  )
}