'use client';

import '@/common/styles/dashboard/dashboard.style.css';
import '@/common/styles/globals.style.css';
import '@/common/styles/home.style.scss';
import { persistor, store } from '@/provider/store';

import styled from '@emotion/styled';
import { StyledEngineProvider } from '@mui/material';
import { MaterialDesignContent, SnackbarProvider } from 'notistack';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: 'rgb(222 255 228)',
    color: 'green',
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: 'rgb(255 222 222)',
    color: 'red',
  },
}));

/**
 * It is a root wrapper for all pages
 * @param {children} props
 * @returns page component with html wrapped around it
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome 4 CDN */}
        <title>Cleercut</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <StyledEngineProvider injectFirst>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
            maxSnack={2}
            Components={{
              success: StyledMaterialDesignContent,
              error: StyledMaterialDesignContent,
            }}
          >
            {/* <Provider store={store}>{children}</Provider> */}
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                {children}
              </PersistGate>
            </Provider>
          </SnackbarProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
