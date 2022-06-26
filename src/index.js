import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserStateProvider } from './context/userContext';
import { SpinnerContextProvider } from './context/SpinnerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <SpinnerContextProvider>
      <UserStateProvider>
        <App />
      </UserStateProvider>
    </SpinnerContextProvider>
  // </React.StrictMode>
);