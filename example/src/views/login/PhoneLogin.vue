<template>
  <v-card-text>
    <v-text-field
      label="휴대폰"
      color="primary"
      type="tel"
      v-model="form.phone"
      :rules="[options.rules.required]">
      <template v-slot:append-inner>
        <v-btn
          @click="verifyPhone"
          :loading="loading.verifyPhone"
          :disabled="(options.rules.required(this.form.phone) !== true)"
          color="primary"
          class="mt-n2">
          인증번호 요청
        </v-btn>
      </template>
    </v-text-field>
    <v-text-field
      v-model="form.code"
      label="인증번호"
      :rules="[options.rules.required]">
      <template v-slot:append-inner>
        <span>{{ remainTime }}</span>
      </template>
    </v-text-field>
    <v-btn
      @click="loading.confirmPhone = true;
      capacitor.confirmPhoneNumber({ code: form.code })"
      :loading="loading.confirmPhone"
      :disabled="(options.rules.required(this.form.code) !== true)"
      color="primary"
      block>
      로그인
    </v-btn>
    <div ref="recaptcha">
    </div>
  </v-card-text>
</template>

<script>
import capacitor from '@/capacitor/firebase';

export default {
  name: 'PhoneLogin',
  data: () => ({
    loading: {
      verifyPhone: false,
      confirmPhone: false,
    },
    form: {
      phone: '',
      code: '',
    },
    options: {
      remain: {
        value: 0,
        timer: null,
      },
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
  computed: {
    remainTime() {
      const min = Math.floor(this.options.remain.value / 60);
      const sec = this.options.remain.value - (min * 60);

      return `${min.toString(10).padStart(2, '0')}:${sec.toString(10).padStart(2, '0')}`;
    },
  },
  mounted() {
    console.log('this.googleAuth2:', this.capacitor);

    this.capacitor.addListener('google.auth.phone.code.sent', () => {
      console.log('code sent');
      this.loading.verifyPhone = false;
    });
  },
  methods: {
    verifyPhone() {
      this.loading.verifyPhone = true;
      this.capacitor.verifyPhoneNumber({
        phone: this.form.phone,
        elem: this.$refs.recaptcha,
      });
      this.resetRemainTime();
    },
    resetRemainTime() {
      if (this.options.remain.timer != null) {
        clearInterval(this.options.remain.timer);
      }

      this.options.remain.value = 2 * 60;

      this.options.remain.timer = setInterval(() => {
        this.options.remain.value = (this.options.remain.value > 0)
          ? this.options.remain.value - 1 : 0;

        if (this.options.remain.value === 0) {
          clearInterval(this.options.remain.timer);
          this.options.remain.timer = null;
        }
      }, 1000);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
