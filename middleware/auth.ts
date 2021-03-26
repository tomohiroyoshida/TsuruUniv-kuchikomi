import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import { User } from 'types/State'
import db from '@/plugins/firebase'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていなくてもアクセスできるパス(これ以外のパスはログインが必要)
  const NO_LOGIN_NEEDED_PATHS = ['index', 'terms', 'privacy', 'login']
  const defaultImage =
    'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'

  // 認証状態の監視
  firebase.auth().onAuthStateChanged(async (signInUser) => {
    if (signInUser) {
      const docRef = db.collection('users').doc(signInUser.uid)
      // firestore/users に登録されているユーザー情報
      const fireUser: User = await docRef
        .get()
        .then((doc) => doc.data() as User)

      // 2回目以降のログイン
      if (fireUser) {
        const userInfo: User = {
          uid: signInUser.uid,
          username: fireUser.username
            ? fireUser.username
            : signInUser.displayName || '名無しのユーザー',
          department: fireUser.department || '',
          photoURL: fireUser.photoURL || '',
          twitterURL: fireUser.twitterURL || ''
        }
        store.dispatch('setUser', userInfo)
        docRef.set(userInfo)
      }
      // 初めてログイン
      else {
        const userInfo: User = {
          uid: signInUser.uid,
          username: signInUser.displayName || '名無しのユーザー',
          department: '',
          photoURL: signInUser.photoURL || defaultImage,
          twitterURL: ''
        }
        store.dispatch('setUser', userInfo)
        docRef.set(userInfo)
      }
    } else {
      // 現在のパスが「ログインしていなくてもアクセスできるパス」でないならリダイレクト
      const currentPath = route.name
      if (currentPath)
        if (!NO_LOGIN_NEEDED_PATHS.includes(currentPath)) redirect('/login')
    }
  })

  // ログイン状態の永続性(session)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
})
