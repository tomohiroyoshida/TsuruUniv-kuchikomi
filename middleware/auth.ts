import firebase from 'firebase'
import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { User } from 'types/State'
import db from '@/plugins/firebase'
// import usersList from '@/plugins/users'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていないとアクセスできないパス
  const loggedInPaths = ['index', 'terms', 'privacy', 'login']
  const vuexUser = store.getters.user
  const defaultImage =
    'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'
  // 認証状態の監視
  firebase.auth().onAuthStateChanged(async (googleUser) => {
    if (googleUser) {
      const docRef = db.collection('users').doc(googleUser.uid)
      const fireUser: User = await docRef
        .get()
        .then((doc) => doc.data() as User)
      const userInfo: User = {
        uid: googleUser.uid,
        username: vuexUser.username || fireUser.username || '【匿名】',
        photoURL: googleUser.photoURL || defaultImage,
        faculty: vuexUser.faculty || fireUser.faculty || '',
        department: vuexUser.department || fireUser.department || ''
      }
      store.dispatch('setUser', userInfo)
      docRef.set(userInfo)

      // const isUser = usersList.find((item) => item.uid === user.uid)
      // if (!isUser) {
      //   try {
      //     ('/edit-profile')
      //   } catch {}
      // }
    } else {
      const currentPath = route.name
      if (currentPath) {
        if (!loggedInPaths.includes(currentPath)) {
          redirect('/login')
        }
      }
    }
  })
  // 永続性
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
})
