<template>
  <v-container id="search" fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 検索ボックス -->
        <div class="text-h6 d-flex justify-center my-3">口コミ検索</div>
        <div class="search-field">
          <v-text-field
            v-model="searchContent"
            solo
            dense
            rounded
            outlined
            clearable
            color="light-blue"
            placeholder="授業名を入力 検索"
            append-outer-icon="mdi-magnify"
            @click:append-outer="search(searchContent)"
          />
        </div>
        <!-- 検索結果一覧 -->
        <div class="text-h6 d-flex justify-center mb-3">検索結果</div>
        <div v-if="isLoading" class="d-flex justify-center text-h6 mt-10">
          <v-progress-circular
            indeterminate
            size="100"
            width="6"
            color="light-blue lighten-3"
          />
        </div>
        <div v-if="kuchikomis">
          <v-card
            v-for="item in kuchikomis"
            :key="item.id"
            class="card my-2"
            rounded
            outlined
            max-width="50rem"
          >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>講師: {{ item.teacher }}</v-card-subtitle>
            <v-card-text class="d-flex card-text">
              <!-- <div class="pr-3">平均評価: {{ item.rating }} / 5</div> -->
              <!-- <div>口コミ数: {{ item.numOfKuchikomi }} 個</div> -->
              <v-card-actions class="btn">
                <v-btn
                  color="light-blue"
                  rounded
                  outlined
                  @click="goToDetail(item.title)"
                >
                  詳細を見る
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </div>
        <div v-else class="text-h6 d-flex justify-center mb-3">
          クチコミが存在しません。
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
const items = [
  {
    id: '1',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  },
  {
    id: '2',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  },
  {
    id: '3',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  },
  {
    id: '4',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  },
  {
    id: '5',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  },
  {
    id: '6',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  },
  {
    id: '7',
    title: '英語学概論',
    teacher: '吉田智洋',
    dayOfWeek: '月',
    period: '1',
    numOfKuchikomi: '10',
    rating: '4.5'
  }
]
export default defineComponent({
  name: 'search',
  setup(_, { root }) {
    const searchContent = ref('')
    const kuchikomis = ref<any>([])
    const isLoading = ref(false)

    // クチコミを検索
    const search = async (title: string) => {
      console.debug('title: ', title)
      // タイトルが空文字またはnullの時は何もしない
      if (title === '' || title === null) return
      isLoading.value = true
      // 一度クチコミを空にする
      kuchikomis.value = []
      // クチコミ取得
      await db
        .collection('classes')
        .doc(title)
        .get()
        .then((doc) => {
          kuchikomis.value.push(doc.data())
        })
      console.debug('data:', kuchikomis.value)
      isLoading.value = false
    }
    // 詳細ページへ飛ぶ
    const goToDetail = (title: string) => {
      root.$router.push(`/search/${title}`)
    }

    return {
      isLoading,
      search,
      items,
      searchContent,
      goToDetail,
      kuchikomis
    }
  }
})
</script>

<style scoped>
#search {
  margin-top: 3rem;
}

/* アイテムを真ん中に置く */
.search-field,
.card {
  margin: 0 auto;
}

/* ボタンの位置をタイトルの右側に置く */
.card {
  position: relative;
}
.btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* 画面幅が1440px以上の時 */
@media (min-width: 1440px) {
  .search-field {
    width: 40rem;
  }
}
</style>
