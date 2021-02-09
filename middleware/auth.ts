import firebase from 'firebase'
import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { User } from 'types/State'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていないとアクセスできないパス
  const loggedInPaths = [
    '/create',
    '/create/',
    '/create/new-class',
    '/create/new-class/',
    '/search',
    '/search/'
  ]
  // 認証状態の監視
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // TODO: ユーザ名は自由に変えられるようにする
      const userInfo: User = {
        uid: user.uid,
        username: user.displayName || '匿名ユーザー',
        photoURL: user.photoURL,
        loggedIn: true
      }
      store.dispatch('setUser', userInfo)
    } else {
      const currentPath = route.path
      if (loggedInPaths.includes(currentPath)) {
        redirect('/login')
      }
    }
  })
  // 永続性
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
})
