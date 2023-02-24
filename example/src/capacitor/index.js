import { GoogleAuthentication } from '@kim5257/capacitor-google-authentication';
import firebaseConfig from '@/config/firebase_config.json';
import router from '@/router';

let googleAuthStateUpdated = false;

GoogleAuthentication.initialize(firebaseConfig).then(() => {});

console.log('GoogleAuthentication:', GoogleAuthentication);

GoogleAuthentication.addListener('google.auth.state.update', () => {
  googleAuthStateUpdated = true;
});

router.beforeEach(async (to, from, next) => {
  const { idToken } = await GoogleAuthentication.getIdToken({ forceRefresh: false });

  console.log('beforeEach:', to.meta, from.meta, idToken);

  const needGuard = googleAuthStateUpdated
    && ((idToken !== '' && to.meta.needNonAuth)
    || (idToken === '' && to.meta.needAuth));

  console.log('beforeEach:', to.meta, from.meta, idToken, needGuard);

  if (needGuard) {
    next(false);
  } else {
    next();
  }
});

async function checkAuth() {
  const { idToken } = await GoogleAuthentication.getIdToken({ forceRefresh: true });
  const { meta } = router.currentRoute.value;

  console.log('idToken:', idToken, meta);

  if (idToken !== '' && meta.needNonAuth) {
    router.push('/').then(() => {});
  } else if (idToken === '' && meta.needAuth) {
    router.push('/login').then(() => {});
  }
}

export default {
  verifyPhoneNumber: GoogleAuthentication.verifyPhoneNumber,
  confirmPhoneNumber: GoogleAuthentication.confirmPhoneNumber,
  createUserWithEmailAndPassword: GoogleAuthentication.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: GoogleAuthentication.signInWithEmailAndPassword,
  getIdToken: GoogleAuthentication.getIdToken,
  signOut: GoogleAuthentication.signOut,
  echo: GoogleAuthentication.echo,
  addListener: GoogleAuthentication.addListener,
  checkAuth,
};
