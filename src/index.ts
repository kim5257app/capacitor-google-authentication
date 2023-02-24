import { registerPlugin } from '@capacitor/core';

import type { GoogleAuthenticationPlugin } from './definitions';
import { GoogleAuthenticationWeb } from './web';

const GoogleAuthentication = registerPlugin<GoogleAuthenticationPlugin>('GoogleAuthentication', {
  web: new GoogleAuthenticationWeb(),
});

export * from './definitions';
export { GoogleAuthentication };
