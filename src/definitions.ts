import type { FirebaseOptions } from 'firebase/app';

export interface GoogleAuthenticationPlugin {
  initialize(config: FirebaseOptions): Promise<{ result: 'success' | 'error'}>;

  verifyPhoneNumber(options: { phone: string }): Promise<{ result: 'success' | 'error'}>;

  confirmPhoneNumber(options: { code: string }): Promise<{ result: 'success' | 'error' }>;

  getIdToken(options: { forceRefresh: boolean })
    : Promise<{
      result: 'success' | 'error';
      idToken: string;
    }>;

  signOut(): Promise<{ result: 'success' | 'error' }>;

  echo(options: { value: string }): Promise<{ value: string }>;
}
