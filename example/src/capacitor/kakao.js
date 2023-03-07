import { KakaoAuthentication } from './kakao_module';

KakaoAuthentication.initialize({
  webKey: '74cd730914445413c2352606f1a05e25',
  nativeKey: 'f62409f07dc6bb2a3f7a0d66a02dcfcc',
}).then(() => {});

console.log('KakaoAuthentication:', KakaoAuthentication);

export default {
  signIn: KakaoAuthentication.signIn,
  callback: KakaoAuthentication.callback,
};
