import { lazy } from 'react';

const EditMessages = lazy(
    () => import('./editMessages' /* webpackChunkName: "editMessages" */)
);

export default EditMessages;