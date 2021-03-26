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
      <!-- アイコンボタン -->
      <v-menu v-if="loggedinUser.uid" open-on-hover bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon class="pa-1 mr-1" large v-bind="attrs" v-on="on">
            <!-- <v-icon color="primary lighten-1" size="52">
              mdi-account-circle
            </v-icon> -->
            <v-img
              class="image"
              :src="loggedinUser.photoURL"
              max-height="45"
              max-width="45"
            />
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group color="grey darken-1">
            <v-list-item two-line @click="toProfile">
              <v-list-item-title>
                <v-icon>mdi-account-cog-outline</v-icon>
                プロフィール設定
              </v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item two-line @click="signOut">
              <v-list-item-title>
                <v-icon>mdi-logout</v-icon>
                ログアウト
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 中身 -->
    <nuxt />
  </v-app>
</template>

<script lang="ts" async>
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import { User } from 'types/State'

export default defineComponent({
  name: 'default',
  setup(_, { root }) {
    const width = window.innerWidth
    const loggedinUser = computed(() => root.$store.getters.user)
    const loggedIn = computed(() => root.$store.getters.user.loggedIn)
    const toProfile = () => {
      root.$router.push('/update-profile')
    }

    const signOut = () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          const emptyUser: User = {
            uid: '',
            username: '',
            photoURL: '',
            department: '',
            twitterURL: ''
          }
          root.$store.dispatch('setUser', emptyUser)
        })
        .catch((e) => {
          console.error('default', e)
        })
    }

    return {
      width,
      loggedinUser,
      loggedIn,
      signOut,
      toProfile
    }
  }
})
</script>

<style scoped>
.image {
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
</style>
