import firebase from 'firebase'
import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていないとアクセスできないパス
  const loggedInPaths = [
    '/create',
    '/create/',
    '/create/new-class',
    '/create/new-class/'
  ]
  // 認証状態の監視
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userInfo = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        loggedIn: true
      }
      store.dispatch('setUser', userInfo)
      console.debug('login user: ', userInfo)
    } else {
      const currentPath = route.path
      console.debug('path', currentPath)
      if (loggedInPaths.includes(currentPath)) {
        redirect('/login')
      }
      console.debug('no signing user')
    }
  })
  // 永続性
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {})
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.error('ERROR: ', errorCode, errorMessage)
    })
})
