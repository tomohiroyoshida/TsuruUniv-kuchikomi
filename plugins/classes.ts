import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import db from '@/plugins/firebase'
import { Class } from '@/types/State'

export default defineNuxtPlugin(async ({ store }) => {
  const fetchedClasses: Class[] = []
  const ref = db.collection('classes').doc('21gpXsJ5bXL7NR1p9z5p')
  ref.update({
    dayOfWeek: firebase.firestore.FieldValue.delete(),
    period: firebase.firestore.FieldValue.delete()
  })
  if (store.getters.classes !== []) {
    await db
      .collection('classes')
      .orderBy('classTitle', 'asc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          fetchedClasses.push(doc.data() as Class)
        })
      })
    store.dispatch('setClasses', fetchedClasses)
  }
})
