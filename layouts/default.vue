<template>
  <v-app id="default">
    <!-- ヘッダー -->
    <v-app-bar v-if="width > 700" app flat color="grey lighten-5" outlined>
      <div class="mr-5">みんなのクチコミ</div>
      <!-- TODO:タブにするかも -->
      <v-btn text color="primary" class="mx-1" to="/search">
        <v-icon>mdi-magnify</v-icon>
        <div>検索</div>
      </v-btn>
      <v-divider vertical />
      <v-btn text color="primary" class="mx-1" to="/create">
        <v-icon> mdi-pencil-plus-outline </v-icon>
        <div>作成</div>
      </v-btn>
      <v-divider vertical />
      <v-btn text color="primary" class="mx-1" to="/">
        <v-icon> mdi-file-document-outline </v-icon>
        <div>使い方</div>
      </v-btn>
      <v-spacer />
      <v-btn v-if="!isLoggedIn" depressed color="primary" class="mr-8">
        ログイン
      </v-btn>
      <v-btn v-else outlined small fab color="primary" class="mr-8">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- TODO: ドロワー -->
    <!-- <v-navigation-drawer v-model="isOpenDrawer" app temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="ml-10">メニュー</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list nav>
        <v-list-item-group v-model="selectedItem" active-class="primary--text">
          <v-list-item nuxt link to="/">
            <v-list-item-icon>
              <v-icon>mdi-file-document-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 使い方 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item nuxt link to="/search">
            <v-list-item-icon>
              <v-icon> mdi-magnify </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> クチコミ検索 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item nuxt link to="/create">
            <v-list-item-icon>
              <v-icon>mdi-pencil-plus-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> クチコミ作成 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="!isLoggedIn"
            block
            depressed
            color="primary"
            @click="login"
          >
            <span class="white--text"> ログイン </span>
          </v-btn>
          <v-btn v-else text block color="primary" @click="logout">
            ログアウト
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer> -->

    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'default',
  setup() {
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
    // リストのアイテムが選択されたらドロワーをとじる
    watch(selectedItem, () => (isOpenDrawer.value = false))

    return {
      width,
      isOpenDrawer,
      selectedItem,
      isLoggedIn,
      login,
      logout
    }
  }
})
</script>

<style scoped></style>
