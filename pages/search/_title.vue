<template>
  <div v-if="$fetchState.pending" class="loading">
    <v-progress-circular indeterminate size="100" width="6" color="primary" />
  </div>
  <!-- クチコミ一覧 -->
  <div v-else class="pt-15">
    <!-- クチコミが存在しない場合 -->
    <div v-if="!kuchikomis.length">
      <div class="text-h6 my-3 mx-14">クチコミはまだありません😭</div>
      <div class="text-h6 mx-14">
        もしこの授業を受けたことがあれば、ぜひクチコミの作成をよろしくお願いいたします🙇‍♂️
      </div>
    </div>

    <!-- クチコミが存在する場合 -->
    <div v-else-if="kuchikomis.length">
      <div class="mt-3 text-h6 d-flex justify-center">クチコミ一覧</div>
      <div class="flex">
        <v-card
          v-for="item in kuchikomis"
          :key="item.id"
          class="card"
          rounded
          outlined
          max-width="80rem"
        >
          <!-- アイコン＋ユーザー名 -->
          <div class="d-flex px-1 pt-1">
            <v-icon color="primary"> mdi-account-circle </v-icon>
            <div class="text-body-2 pa-1">{{ item.username }}</div>
          </div>

          <!-- タイトル＋レーティング -->
          <div class="d-flex px-1">
            <v-rating
              :value="item.rating"
              small
              dense
              readonly
              half-increments
              color="warning"
              background-color="grey lighten-1"
            />
            <div class="text-subtitle-2 font-weight-bold px-2">
              {{ item.title }}
            </div>
          </div>
          <!-- 受講年 -->
          <div class="text-caption text--disabled px-2">
            受講年: {{ item.year }} 年
          </div>
          <!-- クチコミの内容 -->
          <v-card-text class="d-flex pa-2">
            {{ item.content }}
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { Kuchikomi } from '@/types/State'

export default defineComponent({
  name: 'search-title',
  setup(_, { root }) {
    const kuchikomis = ref<Kuchikomi[]>([])
    /**
     * init
     * クチコミ一覧を取得
     */
    useFetch(async () => {
      await db
        .collection('classes')
        .doc(root.$route.params.title)
        .collection('kuchikomis')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            kuchikomis.value.push(doc.data() as Kuchikomi)
          })
        })
    })
    console.debug('クチコミのデータ: ', kuchikomis.value)

    return { kuchikomis }
  }
})
</script>

<style scoped>
.card {
  margin: 8px auto;
}

/* カードのレスポンシブ */
@media (min-width: 600px) {
  .flex {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .card {
    width: 49%;
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

.loading {
  margin: auto;
}
</style>
