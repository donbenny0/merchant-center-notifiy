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
      url: 'https://merchant-center-notifiy.vercel.app/',
    },
  },
  oAuthScopes: {
    view: ['view_orders'],
    manage: ['manage_orders'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
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
