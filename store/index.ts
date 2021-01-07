import { NuxtAppOptions, NuxtState } from '@nuxt/types/app'
import { User, Class } from '@/types/State'

export const state = () => ({
  // ユーザーの情報
  user: {
    userId: 'user0001',
    username: 'サンプル太郎',
    loggedIn: false
  },
  //  講義のリスト
  classes: [],
  // 検索ページで検索欄に入力された講義名 + フィルタリングされた講義一覧
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
  // TODO: 講義リストの一覧を保存 いらない？
  setClasses({ commit }: NuxtAppOptions, classes: Class[]) {
    commit('setClasses', classes)
  },
  // 検索ページで検索欄に入力された講義名を保存
  setSearchingTitle({ commit }: NuxtAppOptions, searchingTitle: string) {
    commit('setSearchingTitle', searchingTitle)
  },
  // 検索ページでフィルタリングされた講義一覧
  setFilteredClasses({ commit }: NuxtAppOptions, filteredClasses: string) {
    commit('setFilteredClasses', filteredClasses)
  }
}
