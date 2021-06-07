<template>
  <v-container id="login" class="pa-1">
    <v-row no-gutters justify="center" class="mt-15">
      <v-col cols="12">
        <v-card flat>
          <v-row no-gutters justify="center">
            <v-col cols="12" align-self="center" class="pt-3">
              <h1 class="font-weight-bold text-center">
                Let's Login to Start.
              </h1>
              <div class="text-subtitle-1 font-weight-bold text-center pt-3">
                クチコミの検索・作成にはログインが必要です
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-img
                max-height="300"
                max-width="300"
                src="/login.webp"
                alt="ログインの画像"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- ボタン -->
      <div class="d-flex justify-center mb-2">
        <AppBtn
          color="red lighten-1"
          class="mr-1"
          width="11rem"
          depressed
          @click="loginWithGoogle"
        >
          <v-icon small left class="ma-0 mr-1">mdi-google</v-icon>
          <div class="text-button">Googleでログイン</div>
        </AppBtn>
        <AppBtn
          color="light-blue lighten-1"
          width="11rem"
          depressed
          @click="loginWithTwitter"
        >
          <v-icon small left class="ma-0 mr-1">mdi-twitter</v-icon>
          <div class="text-button">Twitterでログイン</div>
        </AppBtn>
      </div>
      <!-- 利用規約 -->
      <v-col cols="12">
        <div class="text-center mt-5">
          ※ Twitter/Googleアカウント及び権限に関する説明は<a
            href="https://www.notion.so/Q-A-a1f01d9ab2144b248ced87e036285dad"
            target="_blank"
            class="hoge"
          >
            こちらのQ&Aページをご覧ください
          </a>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="text-center mt-5">
          ※
          <nuxt-link to="/terms">利用規約</nuxt-link>、
          <nuxt-link to="/privacy">プライバシーポリシー</nuxt-link>
          に同意したうえでログインしてください。
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" async>
import { defineComponent } from '@nuxtjs/composition-api'
import {
  auth,
  googleAuthProvider,
  twitterAuthProvider
} from '@/plugins/firebase'

export default defineComponent({
  name: 'login',
  setup(_, { root }) {
    // Googleでログイン
    const loginWithGoogle = async () => {
      try {
        await auth.signInWithPopup(googleAuthProvider).then((signedInUser) => {
          signedInUser
            ? root.$router.replace('/search')
            : root.$router.replace('/user')
        })
      } catch (e) {
        console.error('google', e)
      }
    }
    // Twitterでログイン
    const loginWithTwitter = async () => {
      try {
        await auth.signInWithPopup(twitterAuthProvider).then((signedInUser) => {
          signedInUser
            ? root.$router.replace('/search')
            : root.$router.replace('/user')
        })
      } catch (e) {
        console.error('twitter', e)
      }
    }
    return {
      loginWithGoogle,
      loginWithTwitter
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 40px;
}
</style>
