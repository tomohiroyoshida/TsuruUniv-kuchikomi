import { NuxtAppOptions, NuxtState } from '@nuxt/types/app'
import { User, Class } from '@/types/State'

interface OrderedBy {
  rating: boolean
  tags: string[]
}

export const state = () => ({
  // ユーザーの情報
  user: {
    uid: '',
    username: '',
    department: '',
    photoURL: '',
    twitterURL: ''
  } as User,
  // CSRF対策のtoken
  csrfToken: '',
  // 登録されているユーザー一覧
  users: [] as User[],
  //  授業のリスト
  classes: [] as Class[],
  // 検索ページで検索欄に入力された授業名 + フィルタリングされた授業一覧
  searchingTitle: '',
  filteredClasses: [] as Class[],
  // 閲覧している授業の情報
  currentClass: {
    docId: '',
    classTitle: '',
    teacherName: '',
    avgRating: 0,
    tags: [],
    createdBy: '',
    createdAt: ''
  } as Class,
  // 授業一覧が何で並べ替えされているか
  orderedBy: {
    rating: false,
    tags: []
  } as OrderedBy
})

export const getters = {
  user: (state: NuxtState): User => {
    return state.user
  },
  users: (state: NuxtState): User[] => {
    return state.users
  },
  classes: (state: NuxtState): Class[] => {
    return state.classes
  },
  searchingTitle: (state: NuxtState): string => {
    return state.searchingTitle
  },
  csrfToken: (state: NuxtState): string => {
    return state.csrfToken
  },
  currentClass: (state: NuxtState): string => {
    return state.currentClass
  },
  orderedBy: (state: NuxtState): OrderedBy => {
    return state.orderedBy
  }
  // filteredClasses: (state: NuxtState): Class[] => {
  //   return state.filteredClasses
  // },
}

export const mutations = {
  setUser(state: NuxtState, user: User) {
    state.user = user
  },
  setUsers(state: NuxtState, users: User[]) {
    state.users = users
  },
  setClasses(state: NuxtState, classes: Class[]) {
    state.classes = classes
  },
  pushClass(state: NuxtState, newClass: Class) {
    state.classes.push(newClass)
  },
  setSearchingTitle(state: NuxtState, searchingTitle: string) {
    state.searchingTitle = searchingTitle
  },
  setCsrfToken(state: NuxtState, csrfToken: string) {
    state.csrfToken = csrfToken
  },
  setCurrentClass(state: NuxtState, currentClass: string) {
    state.currentClass = currentClass
  },
  setOrderedByRating(state: NuxtState, isOrderedByRating: boolean) {
    state.orderedBy.rating = isOrderedByRating
  }
  // setFilteredClasses(state: NuxtState, filteredClasses: string) {
  //   state.filteredClasses = filteredClasses
  // },
}

export const actions = {
  // ログインしているユーザーを保存
  setUser({ commit }: NuxtAppOptions, user: User) {
    commit('setUser', user)
  },
  // ユーザーの一覧のリストを保存
  setUsers({ commit }: NuxtAppOptions, users: User[]) {
    commit('setUsers', users)
  },
  // 授業リストの一覧を保存
  setClasses({ commit }: NuxtAppOptions, classes: Class[]) {
    commit('setClasses', classes)
  },
  // 新しい授業を追加
  pushClass({ commit }: NuxtAppOptions, newClass: Class) {
    commit('pushClass', newClass)
  },
  // CSRF対策のTokenを保存
  setCsrfToken({ commit }: NuxtAppOptions, csrfToken: string) {
    commit('setCsrfToken', csrfToken)
  },

  // 検索ページで検索欄に入力された授業名を保存
  setSearchingTitle({ commit }: NuxtAppOptions, searchingTitle: string) {
    commit('setSearchingTitle', searchingTitle)
  },
  // おすすめ順で並べ替え
  setOrderedByRating({ commit }: NuxtAppOptions, isOrderedByRating: boolean) {
    commit('setOrderedByRating', isOrderedByRating)
  },
  // 現在閲覧している授業
  setCurrentClass({ commit }: NuxtAppOptions, currentClass: string) {
    commit('setCurrentClass', currentClass)
  }
  // 検索ページでフィルタリングされた授業一覧
  // setFilteredClasses({ commit }: NuxtAppOptions, filteredClasses: Class[]) {
  //   commit('setFilteredClasses', filteredClasses)
  // },
}
