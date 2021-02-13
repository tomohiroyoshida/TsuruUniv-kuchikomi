// ユーザーの情報
export interface User {
  uid: string
  username: string
  photoURL: string // TODO: 必要？
  department?: string
  faculty?: string
}

// 授業
export interface Class {
  docId: string
  classTitle: string
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
  kuchikomiTitle: String
  classYear: string
  rating: number
  kuchikomi: string
  uid: string
  username: string
  createdAt: string
}
