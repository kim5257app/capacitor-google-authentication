<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
import capacitor from '@/capacitor';

export default {
  name: 'App',
  data: () => ({
    capacitor,
  }),
  mounted() {
    console.log('this.googleAuth:', this.capacitor);

    this.capacitor.addListener('google.auth.phone.verify.completed', () => {
      console.log('confirmed');
    });

    this.capacitor.addListener('google.auth.phone.verify.failed', (error) => {
      console.log('error:', error);
    });

    this.capacitor.addListener('google.auth.state.update', ({ idToken }) => {
      console.log('state update:', idToken);

      this.capacitor.checkAuth();
    });
  },
}
</script>
