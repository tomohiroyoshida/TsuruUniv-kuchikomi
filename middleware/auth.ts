import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import { User } from 'types/State'
import db from '@/plugins/firebase'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていないとアクセスできないパス
  const loggedInPaths = ['index', 'terms', 'privacy', 'login']
  const defaultImage =
    'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'
  // 認証状態の監視
  firebase.auth().onAuthStateChanged(async (googleUser) => {
    if (googleUser) {
      const docRef = db.collection('users').doc(googleUser.uid)
      const fireUser: User = await docRef
        .get()
        .then((doc) => doc.data() as User)
      // 2回目以降のログイン
      if (fireUser) {
        const userInfo: User = {
          uid: googleUser.uid,
          username: fireUser.username
            ? fireUser.username
            : googleUser.displayName || '【匿名】',
          photoURL: googleUser.photoURL || defaultImage,
          faculty: fireUser.faculty ? fireUser.faculty : '',
          department: fireUser.department ? fireUser.department : ''
        }
        store.dispatch('setUser', userInfo)
        docRef.set(userInfo)
      }
      // 初めてログイン
      else {
        const userInfo: User = {
          uid: googleUser.uid,
          username: googleUser.displayName || '【匿名】',
          photoURL: googleUser.photoURL || defaultImage,
          faculty: '',
          department: ''
        }
        store.dispatch('setUser', userInfo)
        docRef.set(userInfo)
      }
    } else {
      const currentPath = route.name
      if (currentPath) {
        if (!loggedInPaths.includes(currentPath)) {
          redirect('/login')
        }
      }
    }
  })

  // ログイン状態の永続性
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
})
