/** 登録されたユーザー一覧をfirestoreから取得 */
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { User } from '@/types/State'

export default defineNuxtPlugin(async ({ store }) => {
  const users: User[] = []
  const storeUsers: User[] = store.getters.users as User[]
  if (!storeUsers.length) {
    await db
      .collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => users.push(doc.data() as User))
      })
    console.debug('plugin users')
    store.dispatch('setUsers', users)
  }
})
