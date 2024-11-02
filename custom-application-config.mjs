import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Notifications',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'orders-notifications',
    },
    production: {
      applicationId: 'cm30jhvvh0043zcqkfqlnl0zd',
      url: 'https://merchant-center-notifiy-3ur18t0r5-dons-projects-6f42b4c1.vercel.app',
    },
  },
  oAuthScopes: {
    view: ['view_orders'],
    manage: ['manage_orders'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/bell.svg}',
  mainMenuLink: {
    defaultLabel: 'Notifications',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'edit-message',
      defaultLabel: 'Edit message',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
