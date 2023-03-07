<template>
  <div></div>
</template>

<script>
import capKakao from '@/capacitor/kakao';
import capFirebase from '@/capacitor/firebase';

export default {
  name: 'LoginCallback',
  props: {
    provider: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    capFirebase.addListener('google.auth.phone.verify.completed', () => {
      this.$router.push('/');
    });

    switch (this.provider) {
      case 'kakao': {
        const firebaseToken = await capKakao.callback({ token: this.token });

        console.log('LoginCallback:', firebaseToken);

        await capFirebase.signInWithCustomToken({ customToken: firebaseToken });
        break;
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
