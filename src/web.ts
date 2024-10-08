import { WebPlugin } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCustomToken,
  updateProfile as updateFirebaseProfile,
  updateEmail as updateFirebaseEmail,
  setPersistence,
  RecaptchaVerifier,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  linkWithPhoneNumber,
  ConfirmationResult,
  updatePhoneNumber,
  Auth,
  User,
  OAuthProvider,
} from 'firebase/auth';

import type { GoogleAuthenticationPlugin, GoogleAuthenticationOptions } from './definitions';
import { Error } from './error';
import { FirebaseError } from '@firebase/util';
import { PhoneAuthProvider } from 'firebase/auth';

export class GoogleAuthenticationWeb extends WebPlugin implements GoogleAuthenticationPlugin {
  private firebaseAuth: Auth | null = null;

  private confirmationResult: ConfirmationResult | null = null;

  private verificationId: string | null = null;

  private recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor() {
    super();
  }

  async initialize(config: GoogleAuthenticationOptions): Promise<{ result: 'success' | 'error' }> {
    this.firebaseAuth = getAuth(initializeApp(config));

    if (config.persistence != null) {
      let persistence = browserLocalPersistence;

      switch (config.persistence) {
        case 'LOCAL':
          persistence = browserLocalPersistence;
          break;
        case 'SESSION':
          persistence = browserSessionPersistence;
          break;
        case 'MEMORY':
          persistence = inMemoryPersistence;
          break;
        default:
          break;
      }

      await setPersistence(this.firebaseAuth, persistence);
    }

    console.log('initialize:', this.firebaseAuth);

    onAuthStateChanged(this.firebaseAuth, async (user) => {
      const idToken = await user?.getIdToken(true);

      this.notifyListeners('google.auth.state.update', {
        idToken: (idToken != null) ? idToken : '',
      });
    });

    return Promise.resolve({ result: 'success' });
  }

  async verifyPhoneNumber({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{
    result: 'success' | 'error'
  }> {
    try {
      console.log('verifyPhoneNumber:', this.firebaseAuth);

      if (this.firebaseAuth == null) {
        Error.throwError(
          'ERROR_NOT_INITIALIZED',
          'Not initialized',
        );
      }

      if (this.recaptchaVerifier == null || elem.childElementCount === 0) {
        console.log('Create Recaptcha');
        this.recaptchaVerifier = new RecaptchaVerifier(this.firebaseAuth, elem, {
          size: 'invisible',
          callback() {
            elem.style.display = 'none !important';
          },
        });
      }

      this.confirmationResult = await signInWithPhoneNumber(this.firebaseAuth, phone, this.recaptchaVerifier);

      this.notifyListeners('google.auth.phone.code.sent', {
        verificationId: null,
        resendingToken: null,
      });

      return Promise.resolve({ result: 'success' });
    } catch (error) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      } else if (error instanceof FirebaseError) {
        message = error.message;
      }

      this.notifyListeners('google.auth.phone.verify.failed', { message });

      throw error;
    }
  }

  async confirmPhoneNumber({ code }: { code: string }): Promise<{ result: 'success' | 'error' }> {
    if (this.confirmationResult == null) {
      throw {
        result: 'error',
        message: 'Invalid access',
      };
    }

    const credential = await this.confirmationResult.confirm(code);

    const idToken = await credential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    });

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async createUserWithEmailAndPassword({ email, password }: { email: string, password: string }): Promise<{
    result: 'success' | 'error';
    idToken: string
  }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      };
    }

    const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    });

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async signInWithEmailAndPassword({ email, password }: { email: string, password: string }): Promise<{
    result: 'success' | 'error';
    idToken: string
  }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      };
    }

    const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    });

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async signInWithGoogle(): Promise<{ result: 'success' | 'error'; idToken: string }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      };
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.firebaseAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (credential == null) {
      throw {
        result: 'error',
        message: 'Sign in failed',
      };
    }

    return {
      idToken: (credential.idToken != null) ? credential.idToken : '',
      result: 'success',
    };
  }

  async signInWithCustomToken({ customToken }: { customToken: string }): Promise<{
    result: 'success' | 'error';
    idToken: string
  }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      };
    }

    const userCredential = await signInWithCustomToken(this.firebaseAuth, customToken);

    const idToken = await userCredential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    });

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async signInWithApple(): Promise<{
    result: "success" | "error";
    idToken: string }> {
    const provider = new OAuthProvider('apple.com');
    provider.setCustomParameters({ locale: 'ko' });
    const result = await signInWithPopup(this.firebaseAuth!, provider);
    const credential = OAuthProvider.credentialFromResult(result);
    const idToken = credential?.idToken ?? '';

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async getIdToken({ forceRefresh }: { forceRefresh: boolean }): Promise<{
    result: 'success' | 'error';
    idToken: string
  }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      };
    }

    const idToken: string | undefined = await this.firebaseAuth.currentUser?.getIdToken(forceRefresh);

    return Promise.resolve({
      result: 'success',
      idToken: (idToken != null) ? idToken : '',
    });
  }

  async getCurrentUser(): Promise<{ result: 'success' | 'error'; user: User | null | undefined }> {

    return {
      result: 'success',
      user: this.firebaseAuth?.currentUser,
    };
  }

  async updateProfile(options: { displayName?: string; photoUri?: string; }): Promise<{ result: 'success' | 'error' }> {
    const user = this.firebaseAuth?.currentUser;

    if (user != null) {
      await updateFirebaseProfile(user, options);
    }

    return { result: 'success' };
  }

  async updateEmail(options: { email: string }): Promise<{ result: 'success' | 'error' }> {
    const user = this.firebaseAuth?.currentUser;

    if (user != null) {
      await updateFirebaseEmail(user, options.email);
    }

    return { result: 'success' };
  }

  async signOut(): Promise<{ result: 'success' | 'error' }> {
    if (this.firebaseAuth == null) {
      throw {
        result: 'error',
        message: 'Not initialized',
      };
    }

    await this.firebaseAuth.signOut();

    return Promise.resolve({ result: 'success' });
  }

  async linkWithPhone({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{ result: 'success' | 'error' }> {
    try {
      console.log('linkWithPhone');

      if (this.firebaseAuth == null) {
        Error.throwError(
          'ERROR_NOT_INITIALIZED',
          'Not initialized',
        );
      }

      if (this.recaptchaVerifier == null || elem.childElementCount === 0) {
        console.log('Create Recaptcha');
        this.recaptchaVerifier = new RecaptchaVerifier(this.firebaseAuth, elem, {
          size: 'invisible',
          callback() {
            elem.style.display = 'none !important';
          },
        });
      }

      const preUserResp = await this.getCurrentUser();

      this.confirmationResult = await linkWithPhoneNumber(preUserResp.user!, phone, this.recaptchaVerifier);

      this.notifyListeners('google.auth.phone.code.sent', {
        verificationId: null,
        resendingToken: null,
      });

      return Promise.resolve({ result: 'success' });
    } catch (error) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      } else if (error instanceof FirebaseError) {
        message = error.message;
      }

      this.notifyListeners('google.auth.phone.verify.failed', { message });

      throw error;
    }
  }

  async confirmLinkPhoneNumber({ code }: { code: string }): Promise<{ result: 'success' | 'error' }> {
    if (this.confirmationResult == null) {
      throw {
        result: 'error',
        message: 'Invalid access',
      };
    }

    const credential = await this.confirmationResult.confirm(code);

    const idToken = await credential.user.getIdToken(false);

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    });

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async updatePhoneNumber({ phone, elem }: { phone: string, elem: HTMLElement }): Promise<{
    result: 'success' | 'error'
  }> {
    try {
      console.log('updatePhone');

      if (this.firebaseAuth == null) {
        Error.throwError(
          'ERROR_NOT_INITIALIZED',
          'Not initialized',
        );
      }

      if (this.recaptchaVerifier == null || elem.childElementCount === 0) {
        console.log('Create Recaptcha');
        this.recaptchaVerifier = new RecaptchaVerifier(this.firebaseAuth, elem, {
          size: 'invisible',
          callback() {
            elem.style.display = 'none !important';
          },
        })
      }

      const provider = new PhoneAuthProvider(this.firebaseAuth);
      this.verificationId = await provider.verifyPhoneNumber(phone, this.recaptchaVerifier);

      this.notifyListeners('google.auth.phone.code.sent', {
        verificationId: null,
        resendingToken: null,
      });

      return Promise.resolve({ result: 'success' });
    } catch (error) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      } else if (error instanceof FirebaseError) {
        message = error.message;
      }

      this.notifyListeners('google.auth.phone.verify.failed', { message });

      throw error;
    }
  }

  async confirmUpdatePhoneNumber({ code }: { code: string }): Promise<{ result: "success" | "error" }> {
    if (this.verificationId == null) {
      throw {
        result: 'error',
        message: 'Invalid access',
      }
    }

    const credential = PhoneAuthProvider.credential(
      this.verificationId,
      code,
    );

    const preUserResp = await this.getCurrentUser();

    if (preUserResp.result !== 'success') {
      throw {
        result: 'error',
        message: 'Invalid access',
      }
    }

    await updatePhoneNumber(preUserResp.user!, credential)

    const idToken = await preUserResp.user!.getIdToken(false)

    this.notifyListeners('google.auth.phone.verify.completed', {
      idToken,
    });

    return Promise.resolve({
      result: 'success',
      idToken,
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
