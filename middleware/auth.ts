import firebase from 'firebase'
import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware(({ store }) => {
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
      console.debug('no signing user')
    }
  })
})
