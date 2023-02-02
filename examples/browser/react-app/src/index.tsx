import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as coxwave from '@coxwave/analytics-browser';

/**
 * Start by calling coxwave.init(). This must be done before any event tracking
 * preferrably in the root file of the project.
 * 
 * Calling init() requires an API key
 * ```
 * coxwave.init(PROJECT_TOKEN)
 * ```
 * 
 * Optionally, a user id can be provided when calling init()
 * ```
 * coxwave.init('PROJECT_TOKEN', {userId: 'example.react.user@coxwave.com'})
 * ```
 * 
 * Optionally, a config object can be provided. Refer to https://coxwave.github.io/coxwave-typescript/interfaces/Types.BrowserConfig.html
 * for object properties.
 */
coxwave.init('PROJECT_TOKEN', {userId: 'example.react.user@coxwave.com'});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
