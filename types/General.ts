// いいね
export interface Like {
  docId: string
  classId: string
  kuchikomiId: string
  likedBy: string
  likeTo: string
  createdAt: string
}

// タグ
export interface Tag {
  text: string
  value: string
  color: string
}
