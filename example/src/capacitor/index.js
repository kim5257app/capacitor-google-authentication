import { GoogleAuthentication } from '@kim5257/capacitor-google-authentication';
import firebaseConfig from '@/config/firebase_config.json';

GoogleAuthentication.initialize(firebaseConfig).then(() => {});

console.log('GoogleAuthentication:', GoogleAuthentication);
