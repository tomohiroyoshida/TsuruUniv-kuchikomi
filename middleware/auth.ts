import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { User } from 'types/State'
import { db, auth, sessionPersistence } from '@/plugins/firebase'

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  // ログインしていなくてもアクセスできるパス(これ以外のパスはログインが必要)
  const NO_LOGIN_NEEDED_PATHS = ['index', 'terms', 'privacy', 'login']
  const defaultImage =
    'https://2.bp.blogspot.com/--IoxlstfWg0/XAY5h7Ruy7I/AAAAAAABQcA/PV17GrN6Io8Yv4Ql1xxq68THYITbRLEMwCLcBGAs/s800/animal_koutei_penguin_hina.png'
  const isLoggedIn = () => {
    return !!store.getters.user.uid
  }

  /** 認証状態の監視 */
  auth.onAuthStateChanged(async (signInUser) => {
    // ログインしている場合何もしない
    // ログインしていない状態->ログインした場合はVuexにuser情報をセット
    if (signInUser && !isLoggedIn()) {
      const docRef = db.collection('users').doc(signInUser.uid)
      // firestore/users に登録されているユーザー情報
      const fireUser: User = await docRef
        .get()
        .then((doc) => doc.data() as User)
      // console.debug('既存のfirestoreのユーザー', fireUser)

      // 2回目以降のログイン
      if (fireUser) {
        const userInfo: User = {
          uid: signInUser.uid,
          username:
            fireUser.username || signInUser.displayName || '名無しのユーザー',
          department: fireUser.department || '',
          photoURL: fireUser.photoURL || defaultImage,
          twitterURL: fireUser.twitterURL || ''
        }
        // console.debug('既存のユーザー', userInfo)
        store.dispatch('setUser', userInfo)
        // docRef.set(userInfo)
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
        // console.debug('新しいユーザー', userInfo)
        store.dispatch('setUser', userInfo)
        docRef.set(userInfo)
      }
    }
    // ログインしていない場合
    else if (!(signInUser || isLoggedIn())) {
      // 現在のパスが「ログインしていなくてもアクセスできるパス」でないならリダイレクト
      const currentPath = route.name
      if (currentPath && !NO_LOGIN_NEEDED_PATHS.includes(currentPath))
        redirect('/login')
    }
  })

  // ログイン状態の永続性(session)
  auth.setPersistence(sessionPersistence)
})
