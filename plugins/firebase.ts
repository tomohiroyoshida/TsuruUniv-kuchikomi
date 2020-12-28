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
db.collection('tests')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.debug('data: ', doc.data())
    })
  })

export default db
