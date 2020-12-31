import { NuxtAppOptions, NuxtState } from '@nuxt/types/app'

export const state = () => ({
  // ユーザーの情報
  user: {
    userId: 'user0001',
    username: 'サンプル太郎',
    loggedIn: false
  },
  //  講義のリスト
  classes: []
})

export const getters = {
  user: (state: NuxtState) => {
    return state.user
  },
  classes: (state: NuxtState) => {
    return state.classes
  }
}

export const mutations = {
  setUser(state: NuxtState, user: User) {
    state.user = user
  },
  setClass(state: NuxtState, classes: Class[]) {
    state.classes = classes
  }
}

export const actions = {
  setUser({ commit }: NuxtAppOptions, user: User) {
    commit('setUser', user)
  },
  setClass({ commit }: NuxtAppOptions, classes: Class[]) {
    commit('setClass', classes)
  }
}
