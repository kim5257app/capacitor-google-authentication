import { WebPlugin } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import type { FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import type { ConfirmationResult, Auth } from 'firebase/auth';

import type { GoogleAuthenticationPlugin } from './definitions';

export class GoogleAuthenticationWeb extends WebPlugin implements GoogleAuthenticationPlugin {
  private firebaseAuth: Auth | null = null;

  private confirmationResult: ConfirmationResult | null = null;

  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // private recaptchaVerifier: firebase.auth.RecaptchaVerifier | null = null;

  constructor() {
    super();
  }

  async initialize(config: FirebaseOptions): Promise<{ result: 'success' | 'error'}> {
    this.firebaseAuth = getAuth(initializeApp(config));
    return Promise.resolve({ result: 'success' });
  }

  async verifyPhoneNumber({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{ result: "success" | "error" }> {
    try {
      if (this.firebaseAuth == null) {
        throw {
          result: 'error',
          message: 'Not initialized',
        }
      }

      if (this.recaptchaVerifier == null) {
        this.recaptchaVerifier = new RecaptchaVerifier(elem, {
          size: 'invisible',
          callback() {
            elem.style.display = 'none !important';
          },
        }, this.firebaseAuth)
      }

      this.confirmationResult = await signInWithPhoneNumber(this.firebaseAuth, phone, this.recaptchaVerifier);

      this.notifyListeners('google.auth.phone.code.sent', {
        verificationId: null,
        resendingToken: null,
      });

      return Promise.resolve({result: 'success'});
    } catch (error) {
      this.notifyListeners('google.auth.phone.verify.failed', { message: error.message });

      throw {
        result: 'error',
        message: error.message,
      }
    }
  }

  async confirmPhoneNumber({ code }: { code: string }): Promise<{ result: "success" | "error" }> {
    if (this.confirmationResult == null) {
      throw {
        result: 'error',
        message: 'Invalid access',
      }
    }

    const userCredential = await this.confirmationResult.confirm(code);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    })

    return Promise.resolve({ result: 'success' });
  }

  async getIdToken({ forceRefresh }: { forceRefresh: boolean }): Promise<{ result: "success" | "error"; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    const idToken: string | undefined  = await this.firebaseAuth.currentUser?.getIdToken(forceRefresh);

    return Promise.resolve({
      result: 'success',
      idToken: (idToken != null) ? idToken : '',
    });
  }

  async signOut(): Promise<{ result: "success" | "error" }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    await this.firebaseAuth.signOut();

    return Promise.resolve({ result: 'success' });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
