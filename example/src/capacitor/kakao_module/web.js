/* global Kakao */
import { WebPlugin } from '@capacitor/core';
import Axios from 'axios';

const kakaoGetTokenPath = 'http://127.0.0.1:5001/capacitor-auth-firebase/asia-northeast3/kakaoGetToken';
const kakaoCustomAuth = 'http://127.0.0.1:5001/capacitor-auth-firebase/asia-northeast3/kakaoCustomAuth';

export class KakaoAuthenticationWeb extends WebPlugin {
  async initialize({ webKey }) {
    Kakao.init(webKey);
    console.log('kakao_module api:', Kakao);
  }

  async signIn() {
    Kakao.Auth.authorize({
      redirectUri: kakaoGetTokenPath,
      prompts: 'login',
    });

    return { result: 'success' };
  }

  async callback({ token }) {
    console.log('callback:', token);

    const resp = await Axios.post(kakaoCustomAuth, { token }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.notifyListeners('kakao.auth.verify.completed', {
      token: resp.data.token,
    });

    console.log('callback:', resp);

    return {
      result: 'success',
      token: resp.data.token,
    };
  }
}
