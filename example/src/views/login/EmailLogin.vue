<template>
  <v-card-text>
    <v-text-field
      v-model="form.email"
      label="이메일"
      color="primary"
      :rules="[options.rules.required, options.rules.email]">
    </v-text-field>
    <v-text-field
      v-model="form.password"
      label="비밀번호"
      :rules="[options.rules.required]"
      @click:append-inner="options.password.hidden = !options.password.hidden"
      :append-inner-icon="(options.password.hidden) ? 'mdi-eye-off' : 'mdi-eye'"
      :type="(options.password.hidden) ? 'password' : 'text'">
    </v-text-field>
    <v-btn
      @click="signIn"
      :loading="loading.signIn"
      color="primary"
      block>
      로그인
    </v-btn>
  </v-card-text>
</template>

<script>
import capacitor from '@/capacitor/firebase';

export default {
  name: 'EmailLogin',
  data: () => ({
    loading: {
      signIn: false,
    },
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
  methods: {
    async signIn() {
      try {
        this.loading.signIn = true;
        await capacitor.signInWithEmailAndPassword(this.form);
      } catch (error) {
        console.error(error);

        if (error.code === 'auth/user-not-found') {
          this.createUser().then(() => {});
        } else {
          this.loading.signIn = false;
        }
      }
    },
    async createUser() {
      try {
        await capacitor.createUserWithEmailAndPassword(this.form);
      } catch (error) {
        console.error(error);

        this.loading.signIn = false;
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
