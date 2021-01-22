// ユーザーの情報
export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  photoURL: string
  createdAt?: Date
}

// 授業の情報
export interface Class {
  title: string
  teacher: string
  dayOfWeek: string
  period: string
  createdAt: Date | null
}

// クチコミ
export interface Kuchikomi {
  title: String
  classYear: string
  rating: number
  content: string
  user: string
  createdAt: Date | null
}
