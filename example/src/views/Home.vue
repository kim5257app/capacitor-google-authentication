<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card
          :max-width="540">
          <v-card-text>
            <v-btn
              @click="capacitor.signOut"
              color="primary"
              block>
              로그아웃
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import capacitor from '@/capacitor/firebase';

export default {
  name: 'Home',
  data: () => ({
    form: {
      email: '',
      password: '',
    },
    options: {
      password: {
        hidden: true,
      },
      rules: {
        required: (value) => (!!value || '필수 항목입니다.'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || '올바르지 않은 이메일 주소입니다.';
        },
      },
    },
    capacitor,
  }),
  beforeRouteEnter() {
    console.log('Home beforeRouteEnter');
  },
}
</script>
