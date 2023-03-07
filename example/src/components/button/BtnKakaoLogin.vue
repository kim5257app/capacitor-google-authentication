<template>
  <button
    class="btn-kakao">
    <img
      alt=""
      :src="loginKakaoIcon">
  </button>
</template>

<script>
import loginKakaoIcon from '@/assets/login/kakao_button.png';

export default {
  name: 'BtnKakaoLogin',
  data: () => ({
    loginKakaoIcon,
  }),
};
</script>

<style lang="scss" scoped>
.btn-kakao {
  --v-btn-size: 0.875rem;
  --v-btn-height: 36px;
  font-size: 0.875rem;
  max-width: 64px;
  padding: 0;
}
</style>
