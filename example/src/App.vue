<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import capFirebase from '@/capacitor/firebase';
import capKakao from '@/capacitor/kakao';

export default {
  name: 'App',
  data: () => ({
    capFirebase,
    capKakao,
  }),
  mounted() {
    console.log('this.googleAuth:', this.capFirebase);

    this.capKakao.addListener('kakao.auth.verify.completed', async ({ token }) => {
      console.log('KakaoLogin:', token);

      await this.capFirebase.signInWithCustomToken({ customToken: token });
    });

    this.capFirebase.addListener('google.auth.phone.verify.completed', () => {
      console.log('confirmed');
    });

    this.capFirebase.addListener('google.auth.phone.verify.failed', (error) => {
      console.log('error:', error);
    });

    this.capFirebase.addListener('google.auth.state.update', ({ idToken }) => {
      console.log('state update:', idToken);
    });
  },
}
</script>
