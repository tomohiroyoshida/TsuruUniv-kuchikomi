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

// // クチコミ
export interface Kuchikomi {
  docId: string
  rating: number
  classYear: string
  kuchikomiTitle: String
  kuchikomi: string
  uid: string // クチコミを作成したユーザーの]ID
  username: string
  classId: string
  classTitle: string
  classTeacherName: string
  createdAt: string
}
// 旧クチコミ型(classes -> kuchikomis)
// export interface Kuchikomi {
//   docId: string
//   rating: number
//   classYear: string
//   kuchikomiTitle: String
//   kuchikomi: string
//   uid: string // クチコミを作成したユーザーの]ID
//   username: string
//   createdAt: string
// }

// kuchikomis collection のクチコミ情報
export interface CollKuchikomi {
  docId: string
  rating: number
  classYear: string
  kuchikomiTitle: String
  kuchikomi: string
  uid: string // クチコミを作成したユーザーの]ID
  username: string
  classId: string
  classTitle: string
  classTeacherName: string
  createdAt: string
}
