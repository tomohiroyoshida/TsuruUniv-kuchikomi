<template>
  <v-app id="default">
    <!-- ヘッダー -->
    <AppHeader :width="width" :loggedin-user="loggedinUser" />
    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'Default',
  setup(_, { root }) {
    const width = window.innerWidth
    const loggedinUser = computed(() => root.$store.getters.user)
    return { width, loggedinUser }
  }
})
</script>
