import { WebPlugin } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  // signInWithRedirect,
  // getRedirectResult,
  signInWithCredential,
  signInWithCustomToken,
  RecaptchaVerifier,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import type { ConfirmationResult, Auth } from 'firebase/auth';

import type { GoogleAuthenticationPlugin, GoogleAuthenticationOptions } from './definitions';

export class GoogleAuthenticationWeb extends WebPlugin implements GoogleAuthenticationPlugin {
  private firebaseAuth: Auth | null = null;

  private confirmationResult: ConfirmationResult | null = null;

  private recaptchaVerifier: RecaptchaVerifier | null = null;

  private recaptchaElement: HTMLElement | null = null;

  constructor() {
    super();
  }

  async initialize(config: GoogleAuthenticationOptions): Promise<{ result: 'success' | 'error'}> {
    this.firebaseAuth = getAuth(initializeApp(config));

    console.log('initialize:', this.firebaseAuth);

    onAuthStateChanged(this.firebaseAuth, async (user) => {
      const idToken = await user?.getIdToken(true);

      this.notifyListeners('google.auth.state.update', {
        idToken: (idToken != null) ? idToken : '',
      });
    });

    return Promise.resolve({ result: 'success' });
  }

  async verifyPhoneNumber({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{ result: "success" | "error" }> {
    try {
      console.log('verifyPhoneNumber:', this.firebaseAuth);

      if (this.firebaseAuth == null) {
        throw {
          result: 'error',
          message: 'Not initialized',
        }
      }

      if (this.recaptchaVerifier == null || this.recaptchaElement?.parentNode == null) {
        console.log('Create Recaptcha');
        this.recaptchaElement = elem;
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

  async createUserWithEmailAndPassword({ email, password }: { email: string, password: string }): Promise<{ result: "success" | "error"; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    })

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async signInWithEmailAndPassword({ email, password }: { email: string, password: string }): Promise<{ result: "success" | "error"; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    })

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async signInWithGoogle(): Promise<{ result: "success" | "error"; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.firebaseAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (credential == null) {
      throw {
        result: 'error',
        message: 'Sign in failed',
      }
    }

    return {
      idToken: (credential.idToken != null) ? credential.idToken : '',
      result: 'success'
    };
  }

  async signInWithCustomToken({ customToken }: { customToken: string }): Promise<{ result: "success" | "error"; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    const userCredential = await signInWithCustomToken(this.firebaseAuth, customToken);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    })

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async signInWithKakao(): Promise<{ result: "success" | "error"; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      }
    }

    const provider = new OAuthProvider('oidc.kakao_module');

    // const result = await signInWithPopup(this.firebaseAuth, provider);
    const kakaoCredential = provider.credential({ idToken: 'eyJraWQiOiI5ZjI1MmRhZGQ1ZjIzM2Y5M2QyZmE1MjhkMTJmZWEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9' });

    // const credential = OAuthProvider.credentialFromResult(result);

    const result = await signInWithCredential(this.firebaseAuth, kakaoCredential);

    const credential = OAuthProvider.credentialFromResult(result);

    if (credential == null) {
      throw {
        result: 'error',
        message: 'Sign in failed',
      }
    }

    return {
      idToken: (credential.idToken != null) ? credential.idToken : '',
      result: 'success'
    };
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
