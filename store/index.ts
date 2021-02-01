import { NuxtAppOptions, NuxtState } from '@nuxt/types/app'
import { User, Class } from '@/types/State'

export const state = () => ({
  // ユーザーの情報
  user: {
    uid: '',
    name: '',
    email: '',
    photoURL: '',
    loggedIn: false
  },
  //  授業のリスト
  classes: [],
  // 検索ページで検索欄に入力された授業名 + フィルタリングされた授業一覧
  searchingTitle: '',
  filteredClasses: []
})

export const getters = {
  user: (state: NuxtState) => {
    return state.user
  },
  classes: (state: NuxtState) => {
    return state.classes
  },
  searchingTitle: (state: NuxtState) => {
    return state.searchingTitle
  },
  filteredClasses: (state: NuxtState) => {
    return state.filteredClasses
  }
}

export const mutations = {
  setUser(state: NuxtState, user: User) {
    state.user = user
  },
  setClasses(state: NuxtState, classes: Class[]) {
    state.classes = classes
  },
  setSearchingTitle(state: NuxtState, searchingTitle: string) {
    state.searchingTitle = searchingTitle
  },
  setFilteredClasses(state: NuxtState, filteredClasses: string) {
    state.filteredClasses = filteredClasses
  }
}

export const actions = {
  // ログインしているユーザーを保存
  setUser({ commit }: NuxtAppOptions, user: User) {
    commit('setUser', user)
  },
  // 授業リストの一覧を保存 いらない？
  setClasses({ commit }: NuxtAppOptions, classes: Class[]) {
    commit('setClasses', classes)
  },
  // 検索ページで検索欄に入力された授業名を保存
  setSearchingTitle({ commit }: NuxtAppOptions, searchingTitle: string) {
    commit('setSearchingTitle', searchingTitle)
  },
  // 検索ページでフィルタリングされた授業一覧
  setFilteredClasses({ commit }: NuxtAppOptions, filteredClasses: string) {
    commit('setFilteredClasses', filteredClasses)
  }
}
