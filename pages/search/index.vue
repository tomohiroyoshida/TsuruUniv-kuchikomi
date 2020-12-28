<template>
  <v-container id="search" fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 検索ボックス -->
        <div class="text-h6 d-flex justify-center my-3">口コミ検索</div>
        <div class="search-field">
          <v-text-field
            v-model="content"
            solo
            dense
            rounded
            outlined
            clearable
            color="teal"
            placeholder="授業名を入力 検索"
            append-outer-icon="mdi-magnify"
            @click:append-outer="search"
          />
        </div>
        <!-- 検索結果一覧 -->
        <div class="text-h6 d-flex justify-center mb-3">検索結果</div>
        <div v-if="$fetchState.pending" class="text-h6">
          検索結果を取得中・・・
        </div>
        <v-card
          v-for="item in items"
          :key="item.id"
          class="card my-1"
          rounded
          outlined
          max-width="50rem"
        >
          <v-card-title>{{ item.title }}</v-card-title>
          <v-card-subtitle>講師: {{ item.teacher }}</v-card-subtitle>
          <v-card-text class="d-flex card-text">
            <div class="pr-3">平均評価: {{ item.rating }} / 5</div>
            <div>口コミ数: {{ item.numOfKuchikomi }} 個</div>
            <v-card-actions class="btn">
              <v-btn color="teal" rounded outlined @click="goToDetail(item.id)">
                詳細を見る
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
// import db from '@/plugins/firebase'
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
  name: 'home',
  setup(_, { root }) {
    const content = ref('')
    const search = () => {
      console.debug('hoge')
    }
    const goToDetail = (id: string) => {
      root.$router.push(`/search/${id}`)
    }
    /**
     * init
     */
    useFetch(async () => {
      await console.log('init')
    })

    return { search, items, content, goToDetail }
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
