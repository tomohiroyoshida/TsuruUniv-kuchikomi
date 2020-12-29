<template>
  <div v-if="$fetchState.pending" class="loading pt-15">
    <v-progress-circular
      indeterminate
      size="100"
      width="6"
      color="light-blue lighten-3"
    />
  </div>
  <!-- クチコミ一覧 -->
  <div v-else class="pt-15">
    <div class="mt-3 text-h6 d-flex justify-center">クチコミ一覧</div>
    <div v-if="kuchikomis">
      <v-card
        v-for="item in kuchikomis"
        :key="item.id"
        class="card"
        rounded
        outlined
        max-width="80rem"
      >
        <!-- アイコン＋ユーザー名 -->
        <div class="d-flex pa-1">
          <v-icon color="light-blue lighten-3"> mdi-account-circle </v-icon>
          <div class="text-body-2 pa-1">{{ item.user }}</div>
        </div>
        <!-- タイトル＋レーティング -->
        <div class="d-flex pa-1">
          <v-rating
            :value="item.rating"
            x-small
            dense
            half-increments
            color="warning"
            background-color="grey lighten-1"
          />
          <div class="text-subtitle-2 font-weight-bold px-2">
            {{ item.title }}
          </div>
        </div>
        <v-card-text class="d-flex card-text">
          {{ item.content }}
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'

export default defineComponent({
  name: 'search-title',
  setup(_, { root }) {
    const kuchikomis = ref<any>([])
    /**
     * init
     * クチコミ一覧を取得
     */
    useFetch(async () => {
      await db
        .collection('classes')
        .doc(root.$route.params.title)
        .collection('クチコミ一覧')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc: any) => {
            kuchikomis.value.push(doc.data())
            console.debug('titleページのデータ: ', doc.data())
          })
        })
    })

    return { kuchikomis }
  }
})
</script>

<style scoped>
.card {
  margin: 8px auto;
}
.loading {
  margin: auto;
}
/* 画面幅が800px以下の時 */
@media (max-width: 800px) {
  .card {
    margin: 8px;
  }
}
</style>
