/// <reference types="@commercetools-frontend/application-config/client" />

import ReactDOM from 'react-dom';
import EntryPoint from './components/entry-point';
console.log('🚀 - Starting the app');

// print all environmet variables
// Print all environment variables to console
console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PUBLIC_URL: process.env.PUBLIC_URL,
  ...process.env
});
ReactDOM.render(<EntryPoint />, document.getElementById('app'));
