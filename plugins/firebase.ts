/** firebase の設定 */
import firebase from 'firebase'

const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECTID
}
// firebase 初期化
firebase.initializeApp(config)
// firestore
const db = firebase.firestore()
// authentication
const auth = firebase.auth()

export { db, auth }
