<template>
  <v-app id="default">
    <!-- TODO: ヘッダーのデザイン -->
    <v-app-bar app color="light-blue lighten-3">
      <v-app-bar-nav-icon @click.stop="isOpenDrawer = !isOpenDrawer" />
      <v-app-bar-title>みんなのクチコミ</v-app-bar-title>
    </v-app-bar>

    <!-- ドロワー -->
    <v-navigation-drawer v-model="isOpenDrawer" app temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>メニュー</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <!-- リスト -->
      <v-list nav>
        <v-list-item-group
          v-model="selectedItem"
          active-class="light-blue--text"
        >
          <!-- 使い方 -->
          <v-list-item nuxt link to="/">
            <v-list-item-icon>
              <v-icon>mdi-file-document-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 使い方 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- 検索 -->
          <v-list-item nuxt link to="/search">
            <v-list-item-icon>
              <v-icon> mdi-magnify </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> クチコミ検索 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- 作成 -->
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
      <!-- ログイン -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            v-if="isLoggedIn"
            block
            depressed
            color="light-blue lighten-3"
            @click="login"
          >
            <span class="white--text"> ログイン </span>
          </v-btn>
          <v-btn
            v-else
            block
            outlined
            color="light-blue lighten-3"
            @click="logout"
          >
            ログアウト
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'default',
  setup() {
    const isOpenDrawer = ref(false)
    const selectedItem = ref(null)
    const isLoggedIn = ref(true)
    const login = () => {
      console.debug('login')
    }
    const logout = () => {
      console.debug('logout')
    }
    // リストのアイテムが選択されたらドロワーをとじる
    watch(selectedItem, () => (isOpenDrawer.value = false))

    return { isOpenDrawer, selectedItem, isLoggedIn, login, logout }
  }
})
</script>

<style scoped></style>
