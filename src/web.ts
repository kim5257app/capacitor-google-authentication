import { WebPlugin } from '@capacitor/core';

import type { GoogleAuthenticationPlugin } from './definitions';

export class GoogleAuthenticationWeb extends WebPlugin implements GoogleAuthenticationPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
