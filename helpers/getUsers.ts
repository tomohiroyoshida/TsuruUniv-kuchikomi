// /** 登録されたユーザー一覧をfirestoreから取得 */
// import { useContext, defineComponent } from '@nuxtjs/composition-api'
// import { db } from '@/plugins/firebase'
// import { User } from '@/types/State'

// // eslint-disable-next-line import/no-mutable-exports
// let getUsers: any
// defineComponent({
//   name: 'SetUsers',
//   setup() {
//     /** TODO: Firestore users collection からユーザ一覧を取得 */
//     const getUsersFunc = async () => {
//       const { store } = useContext()
//       const users: User[] = []
//       const storeUsers: User[] = store.getters.users as User[]
//       if (!storeUsers.length) {
//         await db
//           .collection('users')
//           .limit(5)
//           .get()
//           .then((querySnapshot) => {
//             querySnapshot.forEach((doc) => users.push(doc.data() as User))
//           })
//         console.debug('users:', users)
//         store.dispatch('setUsers', users)
//       }
//     }
//     getUsers = getUsersFunc
//   }
// })

// export { getUsers }
