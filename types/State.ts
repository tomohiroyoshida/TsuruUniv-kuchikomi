// ユーザーの情報
export interface User {
  uid: string
  username: string
  photoURL: string | null
  loggedIn: boolean
}

// 授業
export interface Class {
  docId: string
  title: string
  teacherName: string
  term: string
  dayOfWeek: string
  period: string
  createdAt: Date
}

// クチコミ
export interface Kuchikomi {
  docId: string
  title: String
  classYear: string
  rating: number
  uid: string
  username: string
  content: string
  createdAt: Date
}
