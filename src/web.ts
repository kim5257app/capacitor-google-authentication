import 'firebase/app';

import { WebPlugin } from '@capacitor/core';

import type { GoogleAuthenticationPlugin } from './definitions';

export class GoogleAuthenticationWeb extends WebPlugin implements GoogleAuthenticationPlugin {
  constructor() {

  }

  confirmPhoneNumber({ code }: { code: string }): Promise<{ result: "success" | "error" }> {
    try {


      return Promise.resolve({ result: 'success' });
    } catch (error) {
      throw {
        result: 'error',
        message: error.message,
      }
    }
  }

  getIdToken({ forceRefresh }: { forceRefresh: boolean }): Promise<{ result: "success" | "error"; idToken: string }> {
    return Promise.resolve({ result: 'success', idToken: '' });
  }

  signOut(): Promise<{ result: "success" | "error" }> {
    return Promise.resolve({ result: 'success' });
  }

  verifyPhoneNumber({ phone }: { phone: string }): Promise<{ result: "success" | "error" }> {
    return Promise.resolve({ result: 'success' });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
