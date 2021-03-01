import { NuxtAppOptions, NuxtState } from '@nuxt/types/app'
import { User, Class } from '@/types/State'

export const state = () => ({
  // ユーザーの情報
  user: {
    uid: '',
    username: '',
    photoURL: ''
  },
  // CSRF対策のtoken
  csrfToken: '',
  users: [],
  //  授業のリスト
  classes: [],
  // 検索ページで検索欄に入力された授業名 + フィルタリングされた授業一覧
  searchingTitle: '',
  filteredClasses: []
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
  filteredClasses: (state: NuxtState): Class[] => {
    return state.filteredClasses
  },
  csrfToken: (state: NuxtState): string => {
    return state.csrfToken
  }
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
  setFilteredClasses(state: NuxtState, filteredClasses: string) {
    state.filteredClasses = filteredClasses
  },
  setCsrfToken(state: NuxtState, csrfToken: string) {
    state.csrfToken = csrfToken
  }
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
  // 検索ページで検索欄に入力された授業名を保存
  setSearchingTitle({ commit }: NuxtAppOptions, searchingTitle: string) {
    commit('setSearchingTitle', searchingTitle)
  },
  // 検索ページでフィルタリングされた授業一覧
  setFilteredClasses({ commit }: NuxtAppOptions, filteredClasses: string) {
    commit('setFilteredClasses', filteredClasses)
  },
  // CSRF対策のTokenを保存
  setCsrfToken({ commit }: NuxtAppOptions, csrfToken: string) {
    commit('setCsrfToken', csrfToken)
  }
}
