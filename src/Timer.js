import React, { useEffect,  useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Small contract:
// - Inputs: minutes selected by user
// - Outputs: circular countdown UI, start/pause/reset controls, completed count
// - Error modes: zero/invalid minutes guarded

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const fullSeconds = useMemo(() => Math.max(1, minutes) * 60, [minutes]);

  const [secondsLeft, setSecondsLeft] = useState(fullSeconds);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);


  useEffect(() => {
    // when minutes change while paused, reset the timer to the new length
    setSecondsLeft(fullSeconds);
    setRunning(false);
  }, [fullSeconds]);

  
    useEffect(() => {
      // use a stable 1s interval for countdown — rAF approach was removed
      let intervalId;
      if (running) {
        intervalId = setInterval(() => {
          setSecondsLeft(prev => {
            if (prev <= 1) {
              // will trigger secondsLeft===0 effect on next tick
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [running]);

  useEffect(() => {
    if (secondsLeft === 0) {
      // completed one pomodoro
      setRunning(false);
      setCompleted(c => c + 1);
      // reset to full length and stay paused
      setSecondsLeft(fullSeconds);
    }
  }, [secondsLeft, fullSeconds]);

  const progress = fullSeconds > 0 ? 1 - secondsLeft / fullSeconds : 0;

  // larger size per user request
  const size = 320;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * progress;

  return (
    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
      <Box className="circle-wrap" sx={{width:size, height:size}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="grad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#7C4DFF" />
              <stop offset="100%" stopColor="#6A1B9A" />
            </linearGradient>
          </defs>
          <g transform={`translate(${size/2}, ${size/2})`}>
            <circle r={radius} fill="transparent" stroke="#F3E8FF" strokeWidth={stroke} />
            <circle
              r={radius}
              fill="transparent"
              stroke="url(#grad)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${Math.max(0, circumference - dash)}`}
              transform={`rotate(-90)`}
            />
          </g>
        </svg>
        <Box className="timer-center" sx={{width:size - stroke*2, height:size - stroke*2}}>
          <Typography variant="h2" sx={{fontWeight:700, lineHeight:1}}>{formatTime(secondsLeft)}</Typography>
          <Typography variant="caption" color="text.secondary">{running ? 'Running' : 'Paused'}</Typography>
        </Box>
      </Box>

      <Stack direction={{xs:'column', sm:'row'}} spacing={2} alignItems="center" sx={{width:'100%', justifyContent:'center'}}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="primary" onClick={() => setRunning(r => !r)} aria-label="start-pause">
            {running ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <Button variant="outlined" onClick={() => { setSecondsLeft(fullSeconds); setRunning(false); }} startIcon={<RestartAltIcon />}>Reset</Button>
        </Stack>

        <FormControl size="small" sx={{minWidth:96}}>
          <InputLabel id="minutes-label">Dakika</InputLabel>
          <Select
            labelId="minutes-label"
            value={minutes}
            label="Minutes"
            onChange={(e) => setMinutes(Number(e.target.value))}
          >
            {[5,10,15,20,25,30,45,60].map(m => (
              <MenuItem key={m} value={m}>{m} min</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" sx={{ml:1}}>Tamamlanan Pomodoro: <strong>{completed}</strong></Typography>
      </Stack>
    </Box>
  );
}
