<template>
  <v-app id="default">
    <!-- ヘッダー -->
    <v-app-bar app flat extension-height="60" color="grey lighten-5">
      <div v-if="width > 700" class="text-subtitle-1 font-weight-bold">
        つるコミ
      </div>
      <v-btn
        text
        :small="width < 700"
        class="mx-1"
        color="primary"
        exact
        link
        to="/"
      >
        <v-icon small>mdi-home-outline</v-icon>
        <div>ホーム</div>
      </v-btn>
      <v-divider class="py-2" vertical />
      <v-btn
        text
        :small="width < 700"
        class="mx-1"
        color="primary"
        exact
        link
        to="/search"
      >
        <v-icon small>mdi-magnify</v-icon>
        <div>検索</div>
      </v-btn>
      <v-divider class="py-2" vertical />
      <v-btn
        text
        :small="width < 700"
        class="mx-1"
        color="primary"
        exact
        link
        to="/create"
      >
        <v-icon small> mdi-pencil-plus-outline </v-icon>
        <div>作成</div>
      </v-btn>
      <v-spacer />
      <!-- ログイン・プロフィールボタン -->
      <v-btn
        v-if="!loggedIn"
        :small="width < 700"
        depressed
        to="/login"
        color="primary"
      >
        ログイン
      </v-btn>
      <v-tooltip v-else bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            icon
            color="primary"
            class="pa-1 mr-1"
            x-large
            v-bind="attrs"
            v-on="on"
            @click="openEditModal"
          >
            <v-img
              class="image"
              :src="loggedinUser.photoURL"
              max-height="52"
              max-width="52"
            ></v-img>
          </v-btn>
        </template>
        <span>設定</span>
      </v-tooltip>
    </v-app-bar>

    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import { User } from 'types/State'

export default defineComponent({
  name: 'default',
  setup(_, { root }) {
    const width = ref()
    width.value = window.innerWidth
    const loggedinUser = computed(() => root.$store.getters.user)
    const loggedIn = computed(() => root.$store.getters.user.loggedIn)
    const openEditModal = () => {}

    const signOut = () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          const emptyUser: User = {
            uid: '',
            username: '',
            photoURL: '',
            loggedIn: false
          }
          root.$store.dispatch('setUser', emptyUser)
        })
        .catch((e) => {
          console.error(e)
        })
    }

    return {
      width,
      loggedinUser,
      loggedIn,
      signOut,
      openEditModal
    }
  }
})
</script>

<style scoped>
.image {
  border-radius: 50%;
}
</style>
