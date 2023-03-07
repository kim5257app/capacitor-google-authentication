import { GoogleAuthentication } from '@kim5257/capacitor-google-authentication';
import firebaseConfig from '@/config/firebase_config.json';
import router from '@/router';

let googleAuthStateUpdated = false;
let checkedAuth = false;

GoogleAuthentication.initialize({
  ...firebaseConfig,
  googleClientId: '960104226527-lciq621c5dqi1gfussnc6bor7srpv76m.apps.googleusercontent.com',
}).then(() => {});

console.log('GoogleAuthentication:', GoogleAuthentication);

GoogleAuthentication.addListener('google.auth.state.update', async () => {
  googleAuthStateUpdated = true;
  await checkAuth();
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

router.beforeResolve(async (to, from, next) => {
  console.log('beforeResolve:', to, router.currentRoute.value);

  next();
});

router.afterEach(async (to, from, error) => {
  console.log('afterEach:', to, error);

  if (!checkedAuth) {
    await checkAuth();
  }
})

async function checkAuth() {
  const { idToken } = await GoogleAuthentication.getIdToken({ forceRefresh: true });
  const { meta } = router.currentRoute.value;

  console.log('idToken:', idToken, router.currentRoute.value, meta);

  if (router.currentRoute.value.name != null) {
    if (idToken !== '' && meta.needNonAuth) {
      router.push('/').then(() => {});
    } else if (idToken === '' && meta.needAuth) {
      router.push('/login').then(() => {});
    }

    checkedAuth = true;
  }
}

export default {
  verifyPhoneNumber: GoogleAuthentication.verifyPhoneNumber,
  confirmPhoneNumber: GoogleAuthentication.confirmPhoneNumber,
  createUserWithEmailAndPassword: GoogleAuthentication.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: GoogleAuthentication.signInWithEmailAndPassword,
  signInWithGoogle: GoogleAuthentication.signInWithGoogle,
  signInWithCustomToken: GoogleAuthentication.signInWithCustomToken,
  signInWithKakao: GoogleAuthentication.signInWithKakao,
  getIdToken: GoogleAuthentication.getIdToken,
  signOut: GoogleAuthentication.signOut,
  echo: GoogleAuthentication.echo,
  addListener: GoogleAuthentication.addListener,
  checkAuth,
};
