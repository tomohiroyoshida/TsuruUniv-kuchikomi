/** firebase の設定 */
import firebase from 'firebase'

const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID
}
// firebase 初期化
firebase.initializeApp(config)
// firestore
const db = firebase.firestore()
// authentication
const auth = firebase.auth()
// auth provider(Google)
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
// auth provider(Twitter)
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider()
// session persistence
const sessionPersistence = firebase.auth.Auth.Persistence.SESSION

export { db, auth, googleAuthProvider, twitterAuthProvider, sessionPersistence }
