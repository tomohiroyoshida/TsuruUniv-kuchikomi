// ユーザー
export interface User {
  uid: string
  username: string
  photoURL: string | ArrayBuffer
  // department: string
  // twitterURL: string
}

// 授業
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
  kuchikomiTitle: String
  classYear: string
  rating: number
  kuchikomi: string
  uid: string // クチコミを作成したユーザーの]ID
  username: string
  createdAt: string
}
export interface Like {
  docId: string
  classId: string
  kuchikomiId: string
  likedBy: string
  likeTo: string
  createdAt: string
}
