<template>
  <v-container id="login" class="pa-1">
    <v-row no-gutters justify="center" class="mt-15">
      <v-col cols="12">
        <div class="text-h6 text-center font-weight-bold mt-5">
          SNSでログイン
        </div>
      </v-col>
      <!-- ボタン -->
      <div class="d-flex justify-center mt-3">
        <AppBtn color="red lighten-1 mr-2" depressed @click="loginWithGoogle">
          <v-icon small left>mdi-google</v-icon> Google
        </AppBtn>
        <!-- <AppBtn
          color="light-blue lighten-1"
          depressed
          @click="loginWithTwitter"
        >
          <v-icon small left>mdi-twitter</v-icon> Twitter
        </AppBtn> -->
      </div>
      <!-- 利用規約 -->
      <v-col cols="12">
        <div class="text-center mt-5">
          <nuxt-link to="/terms">利用規約</nuxt-link>、
          <nuxt-link to="/privacy">プライバシーポリシー</nuxt-link>
          に同意したうえでログインしてください。
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import firebase from 'firebase'

const RULES = {
  email: [
    (v: string) =>
      (!!v &&
        !!v.match(
          /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
        )) ||
      '有効なメールアドレスを入力してください。'
  ]
}

export default defineComponent({
  name: 'login',
  setup(_, { root }) {
    const email = ref('')
    const password = ref('')
    const isFormValid = ref(true)
    // Googleでログイン
    const loginWithGoogle = async () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      try {
        await firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            const userObj = result.user
            if (!userObj) return
            const user = {
              uid: userObj.uid,
              name: userObj.displayName,
              email: userObj.email,
              emailVerified: userObj.emailVerified,
              photoURL: userObj.photoURL
            }
            root.$store.dispatch('setUser', user)
            console.debug('user: ', user)
          })
        root.$router.push('/search')
      } catch (e) {
        console.error(e)
      }
    }
    const loginWithTwitter = async () => {
      const provider = new firebase.auth.TwitterAuthProvider()
      try {
        await firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            const userObj = result.user
            if (!userObj) return
            const user = {
              uid: userObj.uid,
              username: userObj.displayName,
              email: userObj.email,
              emailVerified: userObj.emailVerified,
              photoURL: userObj.photoURL
            }
            root.$store.dispatch('setUser', user)
            console.debug('user: ', user)
          })
        root.$router.push('/search')
      } catch (e) {
        console.error(e)
      }
    }
    return {
      RULES,
      email,
      password,
      isFormValid,
      loginWithGoogle,
      loginWithTwitter
    }
  }
})
</script>

<style scoped></style>
