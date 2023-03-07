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
  }

  async callback({ token }) {
    console.log('callback:', token);

    const resp = await Axios.post(kakaoCustomAuth, { token }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('callback:', resp);

    return resp.data.token;
  }
}
