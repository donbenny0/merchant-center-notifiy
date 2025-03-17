/// <reference types="@commercetools-frontend/application-config/client" />

import ReactDOM from 'react-dom';
import EntryPoint from './components/entry-point';

console.log('🚀 - process.env.CLOUD_IDENTIFIER', process.env.CLOUD_IDENTIFIER);
console.log('🚀 - process.env.PROJECT_ID', process.env.PROJECT_ID);
console.log('🚀 - process.env.CUSTOM_APPLICATION_ID', process.env.CUSTOM_APPLICATION_ID);
console.log('🚀 - process.env.ENABLE_NEW_JSX_TRANSFORM', process.env.ENABLE_NEW_JSX_TRANSFORM);
console.log('🚀 - process.env.FAST_REFRESH', process.env.FAST_REFRESH);
console.log('🚀 - process.env.ENTRY_POINT_URI_PATH', process.env.ENTRY_POINT_URI_PATH);
console.log('🚀 - process.env.APPLICATION_URL', process.env.APPLICATION_URL);
ReactDOM.render(<EntryPoint />, document.getElementById('app'));
