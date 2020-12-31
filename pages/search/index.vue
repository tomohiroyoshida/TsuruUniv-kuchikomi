<template>
  <v-container id="search" fluid>
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- 検索ボックス -->
        <div class="text-h6 d-flex justify-center my-3">クチコミ検索</div>
        <div class="search-field">
          <v-text-field
            v-model="searchTitle"
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
                @click="search(searchTitle)"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
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
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'

export default defineComponent({
  name: 'search',
  setup(_, { root }) {
    const searchTitle = ref('')
    const kuchikomis = ref<any>([]) // TODO: データ構造とかが決まったら型つける
    const isLoading = ref(false)

    // クチコミを検索
    const search = async (title: string) => {
      isLoading.value = true
      // 既にクチコミがあれば空にする
      if (kuchikomis.value.length) kuchikomis.value = []
      // クチコミ取得
      await db
        .collection('classes')
        .doc(title)
        .get()
        .then((doc) => {
          if (!doc.data()) return
          kuchikomis.value.push(doc.data())
        })
      console.debug('data:', kuchikomis.value)
      isLoading.value = false
    }

    // 詳細ページへ飛ぶ
    const goToDetail = (title: string) => {
      root.$router.push(`/search/${title}`)
    }

    // 検索欄に文字が入力されていれば検索ボタンが押せるようになるフラグ
    const disabled = computed(() => {
      return searchTitle.value === '' || searchTitle.value === null
    })

    return {
      isLoading,
      search,
      searchTitle,
      goToDetail,
      kuchikomis,
      disabled
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

.v-input >>> .v-input__append-outer {
  margin: 0;
}

/* 画面幅が1440px以上の時 */
@media (min-width: 1440px) {
  .search-field {
    width: 40rem;
  }
}
</style>
