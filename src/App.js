import React from 'react';
import './App.css';
import Timer from './Timer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {

      main: '#7C4DFF'
    },
    secondary: {
      main: '#6A1B9A'
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-root">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" className="gradient-text" sx={{ fontWeight: 700, mb: 1 }}>Pomodoro Sayacı</Typography>
          <Timer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
