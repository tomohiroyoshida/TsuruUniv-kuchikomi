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
  createdBy: string
  createdAt: string
}

// クチコミ
export interface Kuchikomi {
  docId: string
  title: String
  classYear: string
  rating: number
  kuchikomi: string
  kuchikomiTitle: string
  uid: string
  username: string
  createdAt: string
}
