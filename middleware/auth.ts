import firebase from 'firebase'
import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { User } from 'types/State'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていないとアクセスできないパス
  const loggedInPaths = [
    '/create',
    '/create/*',
    '/create/new-class',
    '/create/new-class/',
    '/search',
    '/search/'
  ]

  // const db = firebase.firestore()
  // const setUserInfo = async (userInfo: User): Promise<void> => {
  //   await db.collection('users').doc(userInfo.uid).set(userInfo)
  // }
  // 認証状態の監視
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userInfo: User = {
        uid: user.uid,
        username: user.displayName || '匿名ユーザー',
        photoURL: store.getters.user.photoURL
          ? store.getters.user.photoURL
          : user.photoURL,
        department: store.getters.user.department,
        faculty: store.getters.user.faculty
      }
      store.dispatch('setUser', userInfo)
      // setUserInfo(userInfo)
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
