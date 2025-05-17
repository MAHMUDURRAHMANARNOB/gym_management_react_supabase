import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';
import store from './store';
import { Provider } from 'react-redux';

// Define custom MUI theme with black, maroon, and white
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#800000', // Maroon
//     },
//     secondary: {
//       main: '#1A1A1A', // Black
//     },
//     background: {
//       default: '#FFFFFF', // White
//     },
//     text: {
//       primary: '#1A1A1A', // Black
//       secondary: '#FFFFFF', // White
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           borderRadius: '8px',
//           padding: '8px 16px',
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           boxShadow: 'none',
//         },
//       },
//     },
//   },
// });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme} >
      <CssBaseline /> */}
      <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </Provider>
      
    {/* </ThemeProvider> */}
  </React.StrictMode>
);