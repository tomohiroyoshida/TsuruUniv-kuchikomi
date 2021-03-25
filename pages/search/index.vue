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
        <!-- 並べ替えボタン -->
        <div class="d-flex justify-end">
          <FilteringBtn
            text
            :depressed="isOrderedByRating"
            class="mr-1 px-1"
            @click="orderByRating"
          >
            <v-icon small>mdi-star</v-icon>
            <div class="text-caption">おすすめ順</div>
          </FilteringBtn>
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
            <v-card-title>{{ item.classTitle }}</v-card-title>
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
              <div class="text-caption">クチコミを見る</div>
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
            class="card my-2 pb-2"
            rounded
            outlined
          >
            <v-card-title>{{ item.classTitle }}</v-card-title>
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
              <div class="text-caption">クチコミを見る</div>
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
import { CLASS_TAGS } from '@/data/TAGS'

const RESULT_COMMENT = {
  YES: '検索結果',
  NO: 'まだクチコミが作成されていない、または授業名が正しくありません'
}

export default defineComponent({
  name: 'search',
  setup(_, { root }) {
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
      // root.$store.dispatch('setFilteredClasses', [])
      isSearching.value = false
    })

    // クチコミのページへ飛ぶ
    const goToKuchikomi = (id: string): void => {
      root.$store.dispatch('setSearchingTitle', searchingTitle.value)
      root.$router.push(`/search/${id}`)
    }

    // タグのテキストを表示
    const getTagData = (tag: string) => {
      return CLASS_TAGS.find((item) => item.value === tag)
    }

    // 授業一覧をおすすめ降順で並べ替え
    const orderedByRating: boolean = root.$store.getters.orderedBy.rating
    const isOrderedByRating = ref<boolean>(orderedByRating)
    const orderByRating = () => {
      // フィルタリングされていなければフィルタリングした配列を classList へ代入
      if (!isOrderedByRating.value) {
        const filteredArr: Class[] = Object.assign([], classList.value)
        filteredArr.sort((left, right) =>
          left.avgRating < right.avgRating ? 1 : -1
        )
        classList.value = filteredArr
        isOrderedByRating.value = true
        root.$store.dispatch('setOrderedByRating', true)
      } else {
        // 元の順番に戻す
        classList.value = root.$store.getters.classes
        isOrderedByRating.value = false
        root.$store.dispatch('setOrderedByRating', false)
      }
    }

    /**
     * init
     */
    // storeから全ての授業リスト
    const classList = ref<Class[]>([])
    classList.value = Object.assign([], root.$store.getters.classes)
    // console.debug('classList', classList.value)

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

    // 最初にページを訪れたとき isOrderedByRating === true の場合は授業一覧を並べ替える
    if (isOrderedByRating.value) {
      const filteredArr: Class[] = Object.assign([], classList.value)
      filteredArr.sort((left, right) =>
        left.avgRating < right.avgRating ? 1 : -1
      )
      classList.value = filteredArr
      isOrderedByRating.value = true
    }

    return {
      RESULT_COMMENT,
      getTagData,
      isOrderedByRating,
      orderedByRating,
      orderByRating,
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
