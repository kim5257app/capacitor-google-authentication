<template>
  <v-card-text>
    <div
      class="justify-center d-flex flex-column">
      <btn-google-login
        class="mb-4"
        @click="onGoogleLogin" />
      <btn-kakao-login
        @click="onKakaoLogin" />
    </div>
  </v-card-text>
</template>

<script>
import firebaseCap from '@/capacitor/firebase';
import kakaoCap from '@/capacitor/kakao';
import BtnGoogleLogin from '@/components/button/BtnGoogleLogin.vue';
import BtnKakaoLogin from '@/components/button/BtnKakaoLogin.vue';

export default {
  name: 'SnsLogin',
  components: {
    BtnKakaoLogin,
    BtnGoogleLogin
  },
  methods: {
    onGoogleLogin() {
      console.log('onGoogleLogin!!');
      firebaseCap.signInWithGoogle();
    },
    onKakaoLogin() {
      kakaoCap.signIn();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
