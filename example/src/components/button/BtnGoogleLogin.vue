<template>
  <button
    @click="onClick"
    class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button" data-provider-id="google.com" style="background-color:#ffffff" data-upgraded=",MaterialButton">
    <span class="firebaseui-idp-icon-wrapper">
      <img class="firebaseui-idp-icon" alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg">
    </span>
    <span class="firebaseui-idp-text firebaseui-idp-text-long">
      Sign in with Google
    </span>
    <span class="firebaseui-idp-text firebaseui-idp-text-short">
      Google
    </span>
  </button>
</template>

<script>
import loginGoogleIcon from '@/assets/login/google_buttn.svg';

export default {
  name: 'BtnGoogleLogin',
  data: () => ({
    loginGoogleIcon,
  }),
  methods: {
    onClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="scss" scoped>
.mdl-button {
  background:0 0;
  border:none;
  border-radius:2px;
  color:#000;
  position:relative;
  height:36px;
  margin:0;
  min-width:64px;
  padding:0 16px;
  display:inline-block;
  font-family:Roboto,
  Helvetica,
  Arial,
  sans-serif;
  font-size:14px;
  font-weight:500;
  text-transform:uppercase;
  letter-spacing:0;
  overflow:hidden;
  will-change:box-shadow;
  transition:box-shadow .2s cubic-bezier(.4, 0, 1, 1),
  background-color .2s cubic-bezier(.4, 0, .2, 1),
  color .2s cubic-bezier(.4, 0, .2, 1);
  outline:0;
  cursor:pointer;
  text-decoration:none;
  text-align:center;
  line-height:36px;
  vertical-align:middle
}
.mdl-button::-moz-focus-inner {
  border:0
}
.mdl-button:hover {
  background-color:rgba(158,158,158,.2)
}
.mdl-button:focus:not(:active) {
  background-color:rgba(0,0,0,.12)
}
.mdl-button:active {
  background-color:rgba(158,158,158,.4)
}
.mdl-button.mdl-button--colored {
  color:#3f51b5
}
.mdl-button.mdl-button--colored:focus:not(:active) {
  background-color:rgba(0,0,0,.12)
}
input.mdl-button[type=submit] {
  -webkit-appearance:none
}
.mdl-button--raised {
  background:rgba(158,158,158,.2);
  box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)
}
.mdl-button--raised:active {
  box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);
  background-color:rgba(158,158,158,.4)
}
.mdl-button--raised:focus:not(:active) {
  box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  background-color:rgba(158,158,158,.4)
}
.mdl-button--raised.mdl-button--colored {
  background:#3f51b5;
  color:#fff
}
.mdl-button--raised.mdl-button--colored:hover {
  background-color:#3f51b5
}
.mdl-button--raised.mdl-button--colored:active {
  background-color:#3f51b5
}
.mdl-button--raised.mdl-button--colored:focus:not(:active) {
  background-color:#3f51b5
}
.mdl-button--raised.mdl-button--colored .mdl-ripple {
  background:#fff
}
.mdl-button--icon {
  border-radius:50%;
  font-size:24px;
  height:32px;
  margin-left:0;
  margin-right:0;
  min-width:32px;
  width:32px;
  padding:0;
  overflow:hidden;
  color:inherit;
  line-height:normal
}
.mdl-button--icon .material-icons {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-12px,-12px);
  line-height:24px;
  width:24px
}
.mdl-button--icon.mdl-button--mini-icon {
  height:24px;
  min-width:24px;
  width:24px
}
.mdl-button--icon.mdl-button--mini-icon .material-icons {
  top:0;
  left:0
}
.mdl-button__ripple-container {
  display:block;
  height:100%;
  left:0;
  position:absolute;
  top:0;
  width:100%;
  z-index:0;
  overflow:hidden
}
.mdl-button.mdl-button--disabled .mdl-button__ripple-container .mdl-ripple,
.mdl-button[disabled] .mdl-button__ripple-container .mdl-ripple {
  background-color:transparent
}
.mdl-button--primary.mdl-button--primary {
  color:#3f51b5
}
.mdl-button--primary.mdl-button--primary .mdl-ripple {
  background:#fff
}
.mdl-button--primary.mdl-button--primary.mdl-button--fab,
.mdl-button--primary.mdl-button--primary.mdl-button--raised {
  color:#fff;
  background-color:#3f51b5
}
.mdl-button--accent.mdl-button--accent {
  color:#ff4081
}
.mdl-button--accent.mdl-button--accent .mdl-ripple {
  background:#fff
}
.mdl-button--accent.mdl-button--accent.mdl-button--fab,
.mdl-button--accent.mdl-button--accent.mdl-button--raised {
  color:#fff;
  background-color:#ff4081
}
.mdl-button.mdl-button--disabled.mdl-button--disabled,
.mdl-button[disabled][disabled] {
  color:rgba(0,0,0,.26);
  cursor:default;
  background-color:transparent
}
.mdl-button--fab.mdl-button--disabled.mdl-button--disabled,
.mdl-button--fab[disabled][disabled] {
  background-color:rgba(0,0,0,.12);
  color:rgba(0,0,0,.26)
}
.mdl-button--raised.mdl-button--disabled.mdl-button--disabled,
.mdl-button--raised[disabled][disabled] {
  background-color:rgba(0,0,0,.12);
  color:rgba(0,0,0,.26);
  box-shadow:none
}
.mdl-button--colored.mdl-button--disabled.mdl-button--disabled,
.mdl-button--colored[disabled][disabled] {
  color:rgba(0,0,0,.26)
}
.mdl-button .material-icons {
  vertical-align:middle
}
.firebaseui-input-invalid {
  border-color:#dd2c00
}
.firebaseui-button {
  display:inline-block;
  height:36px;
  margin-left:8px;
  min-width:88px
}
.firebaseui-idp-button,
.firebaseui-tenant-button {
  direction:ltr;
  font-weight:500;
  height:auto;
  line-height:normal;
  max-width:220px;
  min-height:40px;
  padding:8px 16px;
  text-align:left;
  width:100%
}
.firebaseui-idp-icon-wrapper {
  display:table-cell;
  vertical-align:middle
}
.firebaseui-idp-icon {
  border:none;
  display:inline-block;
  height:18px;
  vertical-align:middle;
  width:18px
}
.firebaseui-idp-text {
  color:#fff;
  display:table-cell;
  font-size:14px;
  padding-left:16px;
  text-transform:none;
  vertical-align:middle
}
.firebaseui-idp-text.firebaseui-idp-text-long {
  display:table-cell
}
.firebaseui-idp-text.firebaseui-idp-text-short {
  display:none
}
@media (max-width:268px) {
  .firebaseui-idp-text.firebaseui-idp-text-long {
    display:none
  }
  .firebaseui-idp-text.firebaseui-idp-text-short {
    display:table-cell
  }
}
@media (max-width:320px) {
  .firebaseui-recaptcha-container>div>div {
    transform:scale(.9);
    -webkit-transform:scale(.9);
    transform-origin:0 0;
    -webkit-transform-origin:0 0
  }
}
.firebaseui-idp-google>.firebaseui-idp-text {
  color:#757575
}
</style>
