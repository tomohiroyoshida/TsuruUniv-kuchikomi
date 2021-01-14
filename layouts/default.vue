<template>
  <v-app id="default">
    <!-- ヘッダーのデザイン -->
    <v-app-bar app flat color="primary">
      <v-app-bar-nav-icon @click.stop="isOpenDrawer = !isOpenDrawer" />
      <v-spacer />
      <div class="white--text text-h6 mr-5">みんなのクチコミ</div>
      <v-spacer />
    </v-app-bar>

    <!-- ドロワー -->
    <v-navigation-drawer v-model="isOpenDrawer" app temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="ml-10">メニュー</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <!-- リスト -->
      <v-list shaped>
        <v-list-item-group v-model="selectedItem" active-class="primary--text">
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
            v-if="!isLoggedIn"
            block
            depressed
            rounded
            color="primary"
            @click="login"
          >
            <span class="white--text"> ログイン </span>
          </v-btn>
          <v-btn v-else text block rounded color="primary" @click="logout">
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

    return { isOpenDrawer, selectedItem, isLoggedIn, login, logout }
  }
})
</script>

<style scoped></style>
