import firebase from 'firebase'
const config = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECTID,
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase