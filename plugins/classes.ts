import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { Class } from '@/types/State'

export default defineNuxtPlugin(async ({ store }) => {
  const fetchedClasses: Class[] = []
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
