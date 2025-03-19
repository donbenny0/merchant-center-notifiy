/// <reference types="@commercetools-frontend/application-config/client" />

import ReactDOM from 'react-dom';
import EntryPoint from './components/entry-point';
console.log('🚀 - Starting the application');
console.log('🚀 - env : ENTRY_POINT_URI_PATH',process.env.ENTRY_POINT_URI_PATH);
console.log('🚀 - env : ENABLE_NEW_JSX_TRANSFORM',window.app.ENABLE_NEW_JSX_TRANSFORM);
console.log('🚀 - env : FAST_REFRESH',window.app.FAST_REFRESH);
ReactDOM.render(<EntryPoint />, document.getElementById('app'));
