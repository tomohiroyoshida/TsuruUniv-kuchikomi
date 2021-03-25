interface Tag {
  text: string
  value: string
  color: string // チップの色
}

/** 授業につけるカテゴリータグ */
export const CLASS_TAGS: Tag[] = [
  { text: '般教', value: 'general', color: 'brown darken-1' },
  { text: '体育', value: 'PE', color: 'blue-grey darken-1' },
  { text: 'ゼミ', value: 'zemi', color: 'cyan darken-1' },
  { text: '国文', value: 'japanese', color: 'red darken-1' },
  { text: '英文', value: 'english', color: 'orange darken-3' },
  { text: '比文', value: 'comparativeCulture', color: 'teal darken-2' },
  { text: '国教', value: 'globalEducation', color: 'indigo darken-2' },
  { text: '学教', value: 'teacherEducation', color: 'green' },
  { text: '地社', value: 'communitySociety', color: 'deep-purple lighten-1' }
]
/** クチコミにつけるカテゴリータグ */
export const KUCHIKOMI_TAGS: Tag[] = [
  { text: 'ラクタン', value: 'easy', color: 'pink lighten-3' },
  { text: 'オニタン', value: 'difficult', color: 'deep-purple accent-1' },
  { text: 'オンライン', value: 'online', color: 'light-blue darken-1' }
  // { text: '実習', value: 'workshop', color: '' },
]
