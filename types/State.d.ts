// ユーザーの情報
interface User {
  userId: string
  username: string
  loggedIn: boolean
}

// 講義の情報
interface Class {
  id: string
  title: string
  teacher: string
  dayOfWeek: string
  period: string
  createdAt: any // TODO:
}
