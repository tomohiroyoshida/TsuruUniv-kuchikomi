<template>
  <div v-if="$fetchState.pending" class="loading">
    <v-progress-circular indeterminate size="100" width="6" color="primary" />
  </div>
  <!-- クチコミ一覧 -->
  <v-container v-else fluid class="pt-15">
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <!-- クチコミが存在しない場合 -->
        <div v-if="!kuchikomis.length">
          <div class="text-h6 my-3 mx-14">クチコミはまだありません😭</div>
          <div class="text-h6 mx-14">
            もしこの授業を受けたことがあれば、ぜひクチコミの作成をよろしくお願いいたします🙇‍♂️
          </div>
        </div>

        <!-- クチコミが存在する場合 -->
        <v-row v-else-if="kuchikomis.length" no-gutters>
          <div class="mt-3 mx-1 text-h6 d-flex justify-center">
            クチコミ一覧
          </div>
          <v-col cols="12">
            <v-card
              v-for="item in kuchikomis"
              :key="item.createdAt"
              class="card my-1 ml-1"
              rounded
              outlined
            >
              <!-- アイコン＋ユーザー名 -->
              <div class="d-flex mx-1 mt-2">
                <v-icon color="primary"> mdi-account-circle </v-icon>
                <div class="text-body-2 pa-1">{{ item.username }}</div>
              </div>

              <!-- タイトル＋レーティング -->
              <div class="d-flex px-1 pt-3">
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
              <div class="text-caption text--disabled mx-2">
                受講年: {{ item.year }} 年
              </div>
              <!-- クチコミの内容 -->
              <v-card-text class="d-flex pa-2">
                {{ item.content }}
              </v-card-text>
              <div v-if="isAuthor" class="buttons">
                <v-btn fab icon small>
                  <v-icon color="info">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn fab icon small>
                  <v-icon color="error">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { Kuchikomi } from '@/types/State'

export default defineComponent({
  name: 'search-title',
  setup(_, { root }) {
    const kuchikomis = ref<Kuchikomi[]>([])
    const isAuthor = ref(true)
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

    return { kuchikomis, isAuthor }
  }
})
</script>

<style scoped>
/* 編集＋削除ボタンの位置調整 */
.card {
  position: relative;
}
.buttons {
  position: absolute;
  top: 0;
  right: 20px;
}

/* ローディングアイコンを中央揃え */
.loading {
  margin: auto;
}
</style>
