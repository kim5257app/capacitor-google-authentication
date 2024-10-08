import type { PluginListenerHandle } from '@capacitor/core';
import type { FirebaseOptions } from 'firebase/app';
import { User } from 'firebase/auth';

export interface GoogleAuthenticationOptions extends FirebaseOptions {
  googleClientId: string;
  persistence?: 'LOCAL' | 'SESSION' | 'MEMORY';
}

export interface GoogleAuthenticationPlugin {
  initialize(config: GoogleAuthenticationOptions): Promise<{ result: 'success' | 'error'}>;

  verifyPhoneNumber(options: { phone: string, elem?: HTMLElement }): Promise<{ result: 'success' | 'error'}>;

  confirmPhoneNumber(options: { code: string }): Promise<{ result: 'success' | 'error' }>;

  createUserWithEmailAndPassword(options: { email: string, password: string }): Promise<{ result: "success" | "error"; idToken: string }>;

  signInWithEmailAndPassword(options: { email: string, password: string }): Promise<{ result: "success" | "error"; idToken: string }>;

  signInWithGoogle(): Promise<{ result: "success" | "error"; idToken: string }>;

  signInWithCustomToken({ customToken }: { customToken: string }): Promise<{ result: "success" | "error"; idToken: string }>;

  signInWithApple(): Promise<{ result: "success" | "error"; idToken: string }>;

  getIdToken(options: { forceRefresh: boolean })
    : Promise<{
      result: 'success' | 'error';
      idToken: string;
    }>;

  getCurrentUser(): Promise<{ result: 'success' | 'error'; user: User | null | undefined }>;

  updateProfile(options: { displayName?: string; photoUri?: string; }): Promise<{ result: 'success' | 'error' }>;

  updateEmail(options: { email: string }): Promise<{ result: 'success' | 'error' }>;

  signOut(): Promise<{ result: 'success' | 'error' }>;

  linkWithPhone({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{ result: "success" | "error" }>;

  confirmLinkPhoneNumber(options: { code: string }): Promise<{ result: 'success' | 'error' }>;

  updatePhoneNumber({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{ result: "success" | "error" }>;

  confirmUpdatePhoneNumber(options: { code: string }): Promise<{ result: 'success' | 'error' }>;

  echo(options: { value: string }): Promise<{ value: string }>;

  addListener(
    eventName: 'google.auth.phone.verify.completed',
    listenerFunc: (resp: { idToken: string }) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'google.auth.phone.code.sent',
    listenerFunc: (resp: {
      verificationId: string | null,
      resendingToken: string | null,
    }) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'google.auth.phone.verify.failed',
    listenerFunc: (resp: { message: string }) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'google.auth.state.update',
    listenerFunc: (resp: { idToken: string }) => void,
  ): Promise<PluginListenerHandle>;
}
