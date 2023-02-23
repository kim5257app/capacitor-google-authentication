<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card
          :max-width="540">
          <v-tabs
            v-model="tabs.current">
            <v-tab
              v-for="(tab, tabIdx) in tabs.items"
              :key="`tab_${tabIdx}`"
              :to="tab.to">
              {{ tab.text }}
            </v-tab>
          </v-tabs>
          <router-view>
          </router-view>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    tabs: {
      current: null,
      items: [
        { text: '이메일', to: '/login' },
        { text: '휴대폰', to: '/login/phone' },
        { text: 'SNS', to: '/login/sns' },
      ],
    },
  }),
};
</script>

<style lang="scss" scoped>

</style>
