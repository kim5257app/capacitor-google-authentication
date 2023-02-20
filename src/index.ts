import { registerPlugin } from '@capacitor/core';

import type { GoogleAuthenticationPlugin } from './definitions';

const GoogleAuthentication = registerPlugin<GoogleAuthenticationPlugin>('GoogleAuthentication', {
  web: () => import('./web').then(m => new m.GoogleAuthenticationWeb()),
});

export * from './definitions';
export { GoogleAuthentication };
