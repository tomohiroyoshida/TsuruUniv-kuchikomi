<template>
  <v-container id="search" fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 検索ボックス -->
        <div class="text-h6 d-flex justify-center my-3">クチコミ検索</div>
        <div class="search-field">
          <v-text-field
            v-model="searchingTitle"
            solo
            dense
            rounded
            outlined
            clearable
            color="light-blue"
            placeholder="授業名を入力 検索"
          >
            <template v-slot:append-outer>
              <v-btn
                fab
                text
                small
                :disabled="disabled"
                @click="search(searchingTitle)"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <!-- 検索結果一覧 -->
        <!-- 初めてこのページを訪れたとき -->
        <div v-if="!filteredClasses.length && !isSearchedOnce">
          <div class="text-h6 d-flex justify-center mb-3">
            登録されている講義一覧
          </div>
          <v-card
            v-for="item in fetchedClasses"
            :key="item.id"
            class="card my-2"
            rounded
            outlined
            max-width="50rem"
          >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>講師: {{ item.teacher }}</v-card-subtitle>
            <v-card-text class="d-flex card-text">
              <v-card-actions class="btn">
                <v-btn
                  color="light-blue"
                  rounded
                  outlined
                  @click="goToKuchikomi(item.title)"
                >
                  クチコミを見る
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </div>
        <!-- 検索して講義が存在した時 -->
        <div
          v-else-if="
            (filteredClasses.length && isSearchedOnce) ||
            (filteredClasses.length && !isSearchedOnce)
          "
          class="text-h6 d-flex justify-center mb-3"
        >
          検索結果
        </div>
        <div
          v-else-if="!filteredClasses.length && isSearchedOnce"
          class="text-h6 d-flex justify-center mb-3"
        >
          まだクチコミが作成されていない、<br />または講義名が正しくありません。
        </div>
        <!-- プログレスサークル -->
        <div v-if="isLoading" class="d-flex justify-center text-h6 mt-10">
          <v-progress-circular
            indeterminate
            size="100"
            width="6"
            color="light-blue lighten-3"
          />
        </div>
        <!-- 講義のカード一覧 -->
        <div v-if="filteredClasses.length">
          <v-card
            v-for="item in filteredClasses"
            :key="item.id"
            class="card my-2"
            rounded
            outlined
            max-width="50rem"
          >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>講師: {{ item.teacher }}</v-card-subtitle>
            <v-card-text class="d-flex card-text">
              <v-card-actions class="btn">
                <v-btn
                  color="light-blue"
                  rounded
                  outlined
                  @click="goToKuchikomi(item.title)"
                >
                  詳細を見る
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useFetch
} from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { Class } from '@/types/State'

export default defineComponent({
  name: 'search',
  setup(_, { root }) {
    // クチコミを検索
    const isSearchedOnce = ref(false)
    const searchingTitle = ref('')
    const filteredClasses = ref<Class[]>([])
    const isLoading = ref(false)
    const search = (title: string) => {
      isLoading.value = true
      isSearchedOnce.value = true
      // 既にクチコミがあれば一度空にする
      if (filteredClasses.value.length) filteredClasses.value = []
      // フェッチした全ての授業リストから入力欄にある文字列が含まれる講義リストを取得
      filteredClasses.value = fetchedClasses.value.filter((item) =>
        item.title.includes(title)
      )
      console.debug('検索した結果:', filteredClasses.value)
      // Storeに検索欄に入力された講義名を保存
      root.$store.dispatch('setSearchingTitle', searchingTitle.value)
      root.$store.dispatch('setFilteredClasses', filteredClasses.value)
      isLoading.value = false
    }

    // クチコミのページへ飛ぶ
    const goToKuchikomi = (title: string) => {
      root.$router.push(`/search/${title}`)
    }

    // 検索欄に文字が入力されていれば検索ボタンが押せるようになるフラグ
    const disabled = computed(() => {
      return searchingTitle.value === '' || searchingTitle.value === null
    })

    /**
     * init
     * 全ての講義のリストを取得
     */
    const fetchedClasses = ref<Class[]>([])
    useFetch(async () => {
      await db
        .collection('classes')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            fetchedClasses.value.push(doc.data() as Class)
          })
        })
      console.debug('fetchedClasses:', fetchedClasses.value)
      root.$store.dispatch('setClasses', fetchedClasses.value) // TODO: いらないかも
    })

    /**
     * Storeに検索した結果が残っていれば、それをデフォルトで表示する
     * ブラウザバックしたときに、バックする前の状態に戻すため
     */
    searchingTitle.value = root.$store.getters.searchingTitle
    filteredClasses.value = root.$store.getters.filteredClasses

    return {
      isLoading,
      isSearchedOnce,
      search,
      searchingTitle,
      goToKuchikomi,
      filteredClasses,
      disabled,
      fetchedClasses
    }
  }
})
</script>

<style scoped>
#search {
  margin-top: 3rem;
}

/* アイテムを真ん中に置く */
.search-field {
  margin: 0 auto;
  margin-top: 8px;
}
/* 画面幅が1440px以上の時 */
@media (min-width: 1440px) {
  .search-field {
    width: 40rem;
  }
}

/* ボタンの位置をタイトルの右側に置く */
.card {
  margin: 0 auto;
  position: relative;
}
.btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* 検索欄の虫眼鏡アイコンが持つデフォルトのマージンを消す */
.v-input >>> .v-input__append-outer {
  margin: 0;
}
</style>
