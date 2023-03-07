import { registerPlugin } from '@capacitor/core';
import { KakaoAuthenticationWeb } from './web';

const KakaoAuthentication = registerPlugin('KakaoAuthentication', {
  web: new KakaoAuthenticationWeb(),
});

export { KakaoAuthentication };
