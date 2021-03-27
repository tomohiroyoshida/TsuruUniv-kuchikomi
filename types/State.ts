/** ユーザー */
export interface User {
  uid: string
  username: string
  department: string
  photoURL: string | ArrayBuffer
  twitterURL: string
}

/** 授業 */
export interface Class {
  docId: string
  classTitle: string
  teacherName: string
  avgRating: number
  tags: string[]
  createdBy: string
  createdAt: string
}

// クチコミ
export interface Kuchikomi {
  docId: string
  classYear: string
  rating: number
  kuchikomiTitle: String
  kuchikomi: string
  uid: string // クチコミを作成したユーザーの]ID
  username: string
  createdAt: string
}
