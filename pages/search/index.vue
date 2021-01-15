<template>
  <v-container id="search" fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 検索ボックス -->
        <div class="search-field">
          <TextInput
            v-model="searchingTitle"
            color="primary"
            placeholder="授業名を入力 検索"
            prepend-inner-icon="mdi-magnify"
            class="mx-1"
          />
        </div>

        <!-- 検索結果一覧 -->
        <!-- 検索欄に文字が入力されていない場合、全ての授業のリストを表示 -->
        <section v-if="searchingTitle === '' || searchingTitle === null">
          <div class="text-subtitle-1 mb-3 ml-1">登録されている授業一覧</div>
          <v-row no-gutters>
            <v-col cols="12" class="flex">
              <v-card
                v-for="item in fetchedClasses"
                :key="item.id"
                class="card my-1 mx-1"
                rounded
                outlined
              >
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle class="d-flex py-0">
                  <div class="mr-3">講師: {{ item.teacher }}</div>
                </v-card-subtitle>
                <v-card-subtitle class="py-0">
                  <div class="mr-3">開講期: {{ item.term }}</div>
                  曜日時限: {{ item.dayOfWeek }}曜 {{ item.period }}限
                </v-card-subtitle>
                <v-card-text>
                  <AppBtn
                    class="btn"
                    color="primary"
                    @click="goToKuchikomi(item.title)"
                  >
                    クチコミを見る
                  </AppBtn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- 検索結果のコメント -->
        <div
          v-if="!filteredClasses.length && searchingTitle"
          class="text-h6 d-flex justify-center mb-3"
        >
          {{ RESULT_COMMENT.NO }}
        </div>
        <!-- 授業カード一覧 -->
        <section v-if="filteredClasses.length" class="flex">
          <!-- プログレスサークル -->
          <div v-if="isSearching" class="d-flex justify-center mt-10">
            <v-progress-circular
              indeterminate
              size="70"
              width="6"
              color="primary lighten-3"
            />
          </div>
          <v-card
            v-for="item in filteredClasses"
            :key="item.id"
            class="card my-1 mx-1"
            outlined
          >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>講師: {{ item.teacher }}</v-card-subtitle>
            <v-card-text class="d-flex card-text">
              <v-card-actions class="btn">
                <AppBtn color="primary" @click="goToKuchikomi(item.title)">
                  クチコミを見る
                </AppBtn>
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
  NO: 'まだクチコミが作成されていない、または授業名が正しくありません'
}
export default defineComponent({
  name: 'search',
  setup(_, { root }) {
    const isSearching = ref(false)
    const searchingTitle = ref('')
    const filteredClasses = ref<Class[]>([])
    // 検索欄に文字が入力されるたびにマッチする授業を探す
    watch(searchingTitle, (title: string) => {
      isSearching.value = true
      if (filteredClasses.value.length) filteredClasses.value = []
      // 全ての授業リストから、検索欄にある文字列が含まれる授業を取得
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
    // storeから全ての授業リストをフェッチ
    const fetchedClasses = ref<Class[]>([])
    fetchedClasses.value = root.$store.getters.classes
    console.debug('fetchedClasses', fetchedClasses.value)

    // Storeに 'searchingTitle' があればその授業の一覧を表示する
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

.divider {
  width: 100px;
}

/* 検索ボックスを真ん中に置く */
.search-field {
  margin: 2rem auto 0;
}
/* 画面幅が700px以上の時 */
@media (min-width: 700px) {
  .search-field {
    width: 30rem;
  }
}

/* カードのレスポンシブ */
@media (min-width: 700px) {
  .flex {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .card {
    width: 48%;
  }
}
@media (min-width: 1200px) {
  .flex {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .card {
    width: 24%;
  }
}

/* ボタンの位置をタイトルの右側に置く */
.card {
  position: relative;
}
.btn {
  position: absolute;
  top: 15px;
  right: 15px;
}

/* 検索欄の虫眼鏡アイコンが持つデフォルトのマージンを消す */
.v-input >>> .v-input__append-outer {
  margin: 0;
}
</style>
