<template>
  <v-container id="search" fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 検索ボックス -->
        <title class="text-h6 d-flex justify-center my-3">クチコミ検索</title>
        <div class="search-field">
          <v-text-field
            v-model="searchingTitle"
            solo
            dense
            rounded
            outlined
            clearable
            color="light-blue"
            prepend-inner-icon="mdi-magnify"
            placeholder="授業名を入力 検索"
          />
        </div>

        <!-- 検索結果一覧 -->
        <!-- 検索欄に文字が入力されていない場合、全ての講義のリストを表示 -->
        <section v-if="searchingTitle === '' || searchingTitle === null">
          <title class="text-h6 d-flex justify-center mb-3">
            登録されている講義一覧
          </title>
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
        </section>

        <!-- 検索結果のコメント -->
        <title
          v-if="!filteredClasses.length && searchingTitle"
          class="text-h6 d-flex justify-center mb-3"
        >
          {{ RESULT_COMMENT.NO }}
        </title>
        <!-- 講義カード一覧 -->
        <section v-if="filteredClasses.length">
          <!-- プログレスサークル -->
          <div v-if="isSearching" class="d-flex justify-center mt-10">
            <v-progress-circular
              indeterminate
              size="70"
              width="6"
              color="light-blue lighten-3"
            />
          </div>
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
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'

const RESULT_COMMENT = {
  YES: '検索結果',
  NO: 'まだクチコミが作成されていない、または講義名が正しくありません'
}
export default defineComponent({
  name: 'search',
  setup(_, { root }) {
    const isSearching = ref(false)
    const searchingTitle = ref('')
    const filteredClasses = ref<Class[]>([])
    // 検索欄に文字が入力されるたびにマッチする講義を探す
    watch(searchingTitle, (title: string) => {
      isSearching.value = true
      if (filteredClasses.value.length) filteredClasses.value = []
      // 全ての授業リストから、検索欄にある文字列が含まれる講義を取得
      filteredClasses.value = fetchedClasses.value.filter((item) =>
        item.title.includes(title)
      )

      // Storeを綺麗にする
      root.$store.dispatch('setSearchingTitle', '')
      root.$store.dispatch('setFilteredClasses', [])

      isSearching.value = false
      console.debug('検索した結果:', filteredClasses.value)
    })

    // クチコミのページへ飛ぶ
    const goToKuchikomi = (title: string) => {
      root.$store.dispatch('setSearchingTitle', searchingTitle.value)
      root.$router.push(`/search/${title}`)
    }

    /**
     * init
     */
    // storeから全ての講義リストをフェッチ
    const fetchedClasses = ref<Class[]>([])
    fetchedClasses.value = root.$store.getters.classes
    console.debug('fetchedClasses', fetchedClasses.value)

    // Storeに 'searchingTitle' があればその講義の一覧を表示する
    const storeSearchingTitle = root.$store.getters.searchingTitle
    if (storeSearchingTitle) {
      searchingTitle.value = storeSearchingTitle
      filteredClasses.value = fetchedClasses.value.filter((item) =>
        item.title.includes(searchingTitle.value)
      )
    }

    return {
      RESULT_COMMENT,
      isSearching,
      searchingTitle,
      filteredClasses,
      fetchedClasses,
      goToKuchikomi,
      storeSearchingTitle
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
