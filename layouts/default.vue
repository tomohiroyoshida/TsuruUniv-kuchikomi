<template>
  <v-app id="default">
    <!-- ヘッダー -->
    <v-app-bar app flat extension-height="60" color="grey lighten-5">
      <div v-if="width > 700" class="text-subtitle-1 font-weight-bold">
        つるコミ
      </div>
      <!-- タブにするかも -->
      <v-btn
        text
        :small="width < 700"
        class="mx-1"
        color="primary"
        exact
        @click="goToAbout"
      >
        <v-icon small>mdi-home-outline</v-icon>
        <div>ホーム</div>
      </v-btn>
      <v-divider vertical />
      <v-btn
        text
        :small="width < 700"
        class="mx-1"
        color="primary"
        exact
        @click="goToSearch"
      >
        <v-icon small>mdi-magnify</v-icon>
        <div>検索</div>
      </v-btn>
      <v-divider vertical />
      <v-btn
        text
        :small="width < 700"
        class="mx-1"
        color="primary"
        exact
        @click="goToCreate"
      >
        <v-icon small> mdi-pencil-plus-outline </v-icon>
        <div>作成</div>
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="!isLoggedIn"
        to="/login"
        depressed
        :small="width < 700"
        color="primary"
        class="text-button"
      >
        ログイン
      </v-btn>
      <v-btn v-else fab outlined :small="width < 700" color="primary">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'default',
  setup(_, { root }) {
    const width = ref()
    width.value = window.innerWidth
    const isOpenDrawer = ref(false)
    const selectedItem = ref(null)
    const isLoggedIn = ref(false)
    // TODO
    const login = () => {
      isLoggedIn.value = true
    }
    // TODO
    const logout = () => {
      isLoggedIn.value = false
    }
    const goToSearch = () => {
      root.$router.push('/search')
    }
    const goToCreate = () => {
      root.$router.push('/create')
    }
    const goToAbout = () => {
      root.$router.push('/')
    }
    // リストのアイテムが選択されたらドロワーをとじる
    watch(selectedItem, () => (isOpenDrawer.value = false))

    return {
      width,
      isOpenDrawer,
      selectedItem,
      isLoggedIn,
      login,
      logout,
      goToSearch,
      goToCreate,
      goToAbout
    }
  }
})
</script>

<style scoped></style>
