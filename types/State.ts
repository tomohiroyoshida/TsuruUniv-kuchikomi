// ユーザーの情報
export interface User {
  userId: string
  username: string
  loggedIn: boolean
}

// 授業の情報
export interface Class {
  id: string
  title: string
  teacher: string
  dayOfWeek: string
  period: string
  createdAt: Date
}

// クチコミ
export interface Kuchikomi {
  title: String
  classYear: string
  rating: number
  content: string
  user: string
  createdAt: Date
}
