<template>
  <v-app id="default">
    <!-- ヘッダー -->
    <v-app-bar app flat color="grey lighten-5">
      <div class="text-subtitle-1">つるコミ</div>
      <!-- TODO:タブにするかも -->
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
        :small="width < 700"
        to="/"
        depressed
        color="primary"
        class=""
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
      root.$router.push('/')
    }
    const goToCreate = () => {
      root.$router.push('/create')
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
      goToCreate
    }
  }
})
</script>

<style scoped></style>
