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
      <v-divider vertical />
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
      <v-divider vertical />
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
      <v-btn
        v-if="!loggedIn"
        to="/login"
        depressed
        :small="width < 700"
        color="primary"
      >
        ログイン
      </v-btn>
      <v-btn v-else text :small="width < 700" color="primary" @click="signOut">
        ログアウト
      </v-btn>
    </v-app-bar>

    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import firebase from 'firebase'

export default defineComponent({
  name: 'default',
  setup(_, { root }) {
    const width = ref()
    width.value = window.innerWidth
    const loginUser = computed(() => root.$store.getters.user)
    const loggedIn = computed(() => root.$store.getters.user.loggedIn)

    const signOut = () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          const emptyUser = {
            uid: '',
            name: '',
            email: '',
            photoURL: '',
            loggedIn: false
          }
          root.$store.dispatch('setUser', emptyUser)
          console.debug('signout')
        })
        .catch((e) => {
          console.error(e)
        })
    }

    return {
      width,
      loginUser,
      loggedIn,
      signOut
    }
  }
})
</script>

<style scoped></style>
