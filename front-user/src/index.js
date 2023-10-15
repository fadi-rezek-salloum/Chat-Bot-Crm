import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContextProvider } from './contexts/ContextProvider';
import { MessageProvider } from './contexts/MessgeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>


<AuthProvider>
  <MessageProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </MessageProvider>
</AuthProvider>
</Router>
 

);

