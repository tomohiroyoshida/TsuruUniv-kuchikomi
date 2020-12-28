<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar flat color="green">
      <v-app-bar-nav-icon @click.stop="isOpenDrawer = !isOpenDrawer" />
      <v-app-bar-title>みんなの口コミ</v-app-bar-title>
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
        <v-list-item-group v-model="selectedItem" active-class="green--text">
          <v-list-item nuxt link to="/">
            <v-list-item-icon>
              <v-icon> mdi-magnify </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 口コミ検索 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt link to="/create">
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 口コミ作成 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item nuxt link to="/about">
            <v-list-item-icon>
              <v-icon>mdi-book</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 使い方 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
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
    // リストのアイテムが選択されたらドロワーをとじる
    watch(selectedItem, () => (isOpenDrawer.value = false))

    return { isOpenDrawer, selectedItem }
  }
})
</script>

<style scoped></style>
