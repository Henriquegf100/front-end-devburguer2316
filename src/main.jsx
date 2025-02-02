import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Router } from './routes';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import stripePromise from './config/stripeConfig';
import AppProvider from './hooks';
import GlobalStyles from './styles/globalStyles';
import { standardTheme } from './styles/themes/standard';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={standardTheme}>
      <AppProvider>
        <Elements stripe={stripePromise}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Elements>
        <GlobalStyles />
        <ToastContainer autoClose={2000} theme="colored" />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
