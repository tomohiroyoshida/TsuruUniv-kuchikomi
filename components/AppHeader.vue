<template>
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
          <v-list-item two-line @click="goToProfile">
            <v-list-item-title>
              <v-icon>mdi-account-outline</v-icon>
              プロフィール
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
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { auth } from '@/plugins/firebase'
import { User } from 'types/State'

export default defineComponent({
  name: 'AppHeader',
  props: {
    width: {
      type: Number,
      required: true
    },
    loggedinUser: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup(props, { root }) {
    const goToProfile = () => {
      root.$router.push(`/user/${props.loggedinUser.uid}`)
    }

    const signOut = () => {
      auth
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
    return { goToProfile, signOut }
  }
})
</script>

<style scoped>
/** プロフィール画像を丸く */
.image {
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
</style>
