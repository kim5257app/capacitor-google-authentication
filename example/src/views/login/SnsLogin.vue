<template>
  <v-card-text
    class="justify-center d-flex">
    <btn-google-login @click="onGoogleLogin" />
  </v-card-text>
</template>

<script>
import capacitor from '@/capacitor';
import BtnGoogleLogin from '@/components/button/BtnGoogleLogin.vue';

export default {
  name: 'SnsLogin',
  components: {
    BtnGoogleLogin
  },
  methods: {
    onGoogleLogin() {
      capacitor.signInWithGoogle();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
