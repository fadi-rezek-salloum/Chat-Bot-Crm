import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContextProvider } from './contexts/ContextProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <Router>
  <AuthProvider>
  <ContextProvider>
  <App />
  </ContextProvider>
  

  </AuthProvider>
 
</Router>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();