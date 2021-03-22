<template>
  <v-container id="search">
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <div class="text-h6 d-flex justify-center my-3 font-weight-bold">
          クチコミ検索
        </div>
        <!-- 検索ボックス -->
        <div class="search-field">
          <TextInput
            v-model="searchingTitle"
            color="primary"
            rounded
            placeholder="授業名を入力 検索"
            prepend-inner-icon="mdi-magnify"
            class="mx-1"
          />
        </div>

        <!-- 検索結果一覧 -->
        <!-- 検索欄に文字が入力されていない場合 -->
        <section
          v-if="searchingTitle === '' || searchingTitle === null"
          class="flex"
        >
          <v-card
            v-for="item in classList"
            :key="item.docId"
            class="card my-2 pb-2"
            rounded
            outlined
          >
            <v-card-title class="pt-">{{ item.classTitle }}</v-card-title>
            <v-card-subtitle class="py-0">
              <div class="mr-3">講師： {{ item.teacherName }}</div>
            </v-card-subtitle>
            <!-- TODO: タグ+おすすめ度 -->
            <v-card-text>
              <v-row justify="space-around">
                <v-col cols="12" class="pl-2">
                  <!-- <div v-if="item.tags !== []">
                    <v-chip
                      v-for="(tag, idx) in item.tags"
                      :key="idx"
                      x-small
                      outlined
                      class="mr-1 mb-1"
                      :color="getTagData(tag).color"
                    >
                      {{ getTagData(tag).text }}
                    </v-chip>
                  </div> -->
                  <div class="d-flex justify-start">
                    <v-rating
                      v-model="item.avgRating"
                      half-increments
                      small
                      dense
                      readonly
                      color="star"
                      background-color="grey lighten-1"
                    />
                    ({{ item.avgRating }})
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <AppBtn
              class="btn"
              color="primary"
              width="6rem"
              depressed
              @click="goToKuchikomi(item.docId)"
            >
              <div class="text-caption">クチコミ閲覧</div>
            </AppBtn>
          </v-card>
        </section>

        <!-- 検索結果が無かったときのコメント -->
        <div
          v-if="!filteredClasses.length && searchingTitle"
          class="text-h6 d-flex justify-center mb-3"
        >
          {{ RESULT_COMMENT.NO }}
        </div>

        <!-- 授業カード一覧 -->
        <section v-if="filteredClasses.length && searchingTitle" class="flex">
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
            :key="item.docId"
            class="card my-1 ml-1 pb-5"
            rounded
            outlined
          >
            <v-card-title class="pt-">{{ item.classTitle }}</v-card-title>
            <v-card-subtitle class="py-0">
              <div class="mr-3">講師： {{ item.teacherName }}</div>
            </v-card-subtitle>
            <!-- TODO: タグ -->
            <v-row justify="space-around">
              <v-col cols="12" class="pl-2">
                <!-- <div v-if="item.tags !== []">
                    <v-chip
                      v-for="(tag, idx) in item.tags"
                      :key="idx"
                      x-small
                      outlined
                      class="mr-1 mb-1"
                      :color="getTagData(tag).color"
                    >
                      {{ getTagData(tag).text }}
                    </v-chip>
                  </div> -->
                <div class="d-flex justify-start">
                  <v-rating
                    v-model="item.avgRating"
                    half-increments
                    small
                    dense
                    readonly
                    color="star"
                    background-color="grey lighten-1"
                  />
                  ({{ item.avgRating }})
                </div>
              </v-col>
            </v-row>
            <AppBtn
              class="btn"
              color="primary"
              width="6rem"
              depressed
              @click="goToKuchikomi(item.docId)"
            >
              <div class="text-caption">クチコミ閲覧</div>
            </AppBtn>
          </v-card>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" async>
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'
import { TAGS } from '@/data/TAGS'

const RESULT_COMMENT = {
  YES: '検索結果',
  NO: 'まだクチコミが作成されていない、または授業名が正しくありません'
}

export default defineComponent({
  name: 'search',
  setup(_, { root }) {
    const rating = 4 // FIXME お勧め平均値表示機能できたら消す
    const isSearching = ref(false)
    const filteredClasses = ref<Class[]>([])
    const searchingTitle = ref('')
    // 検索欄に文字が入力されるたびにマッチする授業を探す
    watch(searchingTitle, (title: string): void => {
      isSearching.value = true
      // フィルタリングされた結果が空配列でなければ一度filteredClassesを空にしてから
      if (filteredClasses.value.length) filteredClasses.value = []
      // 全ての授業リストから、検索欄にある文字列が含まれる授業を取得
      filteredClasses.value = classList.value.filter((item) =>
        item.classTitle.includes(title)
      )

      // Storeを綺麗にする
      root.$store.dispatch('setSearchingTitle', '')
      root.$store.dispatch('setFilteredClasses', [])

      isSearching.value = false
    })

    // クチコミのページへ飛ぶ
    const goToKuchikomi = (id: string): void => {
      root.$store.dispatch('setSearchingTitle', searchingTitle.value)
      root.$router.push(`/search/${id}`)
    }

    // タグのテキストを表示
    const getTagData = (tag: string) => {
      return TAGS.find((item) => item.value === tag)
    }

    /**
     * init
     */
    // storeから全ての授業リスト
    const classList = ref<Class[]>([])
    classList.value = root.$store.getters.classes

    // Storeに 'searchingTitle' があればその授業の一覧を表示する
    const storeSearchingTitle = root.$store.getters.searchingTitle
    if (storeSearchingTitle) {
      searchingTitle.value = storeSearchingTitle
      filteredClasses.value = classList.value.filter((item) =>
        item.classTitle.includes(searchingTitle.value)
      )
    }
    // Store の currentClass を空にする
    // eslint-disable-next-line prettier/prettier
    (() => {
      const emptyClass = {
        docId: '',
        classTitle: '',
        teacherName: '',
        createdBy: '',
        createdAt: ''
      }
      root.$store.dispatch('setCurrentClass', emptyClass)
    })()

    return {
      rating,
      RESULT_COMMENT,
      getTagData,
      isSearching,
      searchingTitle,
      filteredClasses,
      classList,
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

/* ボタンの位置をタイトルの右側に置く */
.card {
  position: relative;
}
.btn {
  position: absolute;
  bottom: 8px;
  right: 12px;
}

/* 検索ボックスを真ん中に置く */
.search-field {
  margin: 2rem auto 0;
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
    width: 49.4%;
    margin-left: 4px;
  }
  .search-field {
    width: 30rem;
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
    width: 24.6%;
    margin-left: 4px;
  }
  .btn {
    position: absolute;
    bottom: 6px;
    right: 6px;
  }
}

/* 検索欄の虫眼鏡アイコンが持つデフォルトのマージンを消す */
.v-input >>> .v-input__append-outer {
  margin: 0;
}
</style>
