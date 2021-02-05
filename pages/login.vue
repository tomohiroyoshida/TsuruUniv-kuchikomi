<template>
  <v-container id="login" class="pa-1">
    <v-row no-gutters justify="center" class="mt-15">
      <v-col cols="12">
        <div class="text-h6 text-center font-weight-bold mt-5">
          クチコミ閲覧・作成にはログインが必要です
        </div>
      </v-col>
      <!-- ボタン -->
      <div class="d-flex justify-center mt-5 mb-2">
        <AppBtn color="red lighten-1 mr-2" depressed @click="loginWithGoogle">
          <v-icon small left>mdi-google</v-icon>
          <div class="text-caption">Googleでログイン</div>
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
import { defineComponent } from '@nuxtjs/composition-api'
import firebase from 'firebase'

export default defineComponent({
  name: 'login',
  setup(_, { root }) {
    // Googleでログイン
    const loginWithGoogle = async () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      try {
        await firebase
          .auth()
          .signInWithPopup(provider)
          .then(() => {
            root.$router.replace('/create')
          })
      } catch (e) {
        console.error(e)
      }
    }
    // TODO: Twitterでログイン
    const loginWithTwitter = async () => {
      const provider = new firebase.auth.TwitterAuthProvider()
      try {
        await firebase
          .auth()
          .signInWithPopup(provider)
          .then(() => {
            root.$router.push('/create')
          })
      } catch (e) {
        console.error(e)
      }
    }
    return {
      loginWithGoogle,
      loginWithTwitter
    }
  }
})
</script>

<style scoped></style>
