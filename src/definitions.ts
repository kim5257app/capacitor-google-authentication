export interface GoogleAuthenticationPlugin {
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
