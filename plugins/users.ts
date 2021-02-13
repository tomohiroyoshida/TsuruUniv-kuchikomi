// TODO: ユーザーが最初にログイン、つまりアカウントを作成したときに行う処理を書く
// firesotre の users コレクションへユーザーの情報を追加する
import db from '@/plugins/firebase'
import { User } from '@/types/State'

const usersList: User[] = []
const getUsers = async () => {
  await db
    .collection('users')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc: any) => {
        usersList.push(doc.data() as User)
      })
    })
}
getUsers()
console.debug('users', usersList)

export default usersList
