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
          <div class="text-h6 my-3 px-3">クチコミはまだありません😭</div>
          <div class="text-h6 px-3">
            もしこの授業を受けたことがあれば、ぜひクチコミの作成をよろしくお願いいたします🙇‍♂️
          </div>
        </div>

        <!-- クチコミが存在する場合 -->
        <v-row v-else-if="kuchikomis.length" no-gutters>
          <v-col cols="12">
            <div class="my-3 mx-1 text-h6 d-flex justify-center">
              クチコミ一覧
            </div>
          </v-col>
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
              <!-- 編集・削除ボタン -->
              <div v-if="uid === item.uid" class="buttons">
                <v-btn fab icon small @click="openUpdateDialog">
                  <v-icon color="info">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn fab icon small @click="openDeleteConfirm(item.docId)">
                  <v-icon color="error">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <!-- ダイアログ -->
        <EditDialog v-model="isOpenUpdateDialog" />
        <ConfirmDialog
          v-model="isOpenDeleteConfirm"
          text="削除"
          @ok="deleteKuchikomi"
        />
        <!-- スナックバー -->
        <SnackBar
          v-model="isOpenSuccessUpdateSnackbar"
          text="【成功】クチコミの編集に成功しました💡"
          color="success"
        />
        <SnackBar
          v-model="isOpenSuccessDeleteSnackbar"
          text="【成功】クチコミの削除に成功しました🍙"
          color="success"
        />
        <SnackBar
          v-model="isOpenErrorSnackbar"
          text="【エラー】エラーが起きました。ページをリロードしてもう一度試してください😢"
          color="error"
        />
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
    const classId = root.$route.params.id
    const kuchikomis = ref<Kuchikomi[]>([])
    const uid = root.$store.getters.user.uid

    const isOpenSuccessUpdateSnackbar = ref(false)
    const isOpenSuccessDeleteSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const isOpenUpdateDialog = ref(false)
    const isOpenDeleteConfirm = ref(false)

    // 編集
    const updateTargetId = ref('')
    const openUpdateDialog = (docId: string) => {
      updateTargetId.value = docId
      isOpenUpdateDialog.value = true
    }
    // 削除
    const deleteTargetId = ref('')
    const openDeleteConfirm = (docId: string) => {
      deleteTargetId.value = docId
      isOpenDeleteConfirm.value = true
    }
    const deleteKuchikomi = async (): Promise<void> => {
      try {
        const docId = deleteTargetId.value
        // 削除処理
        await db
          .collection('classes')
          .doc(classId)
          .collection('kuchikomis')
          .doc(docId)
          .delete()
        // 削除後クチコミ一覧のデータを更新
        const newKuchikoims: Kuchikomi[] = []
        await db
          .collection('classes')
          .doc(classId)
          .collection('kuchikomis')
          .get()
          .then((querysnapshot) => {
            querysnapshot.forEach((doc) => {
              newKuchikoims.push(doc.data() as Kuchikomi)
            })
          })
        kuchikomis.value = newKuchikoims
        isOpenDeleteConfirm.value = false
        isOpenSuccessDeleteSnackbar.value = true
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
    }

    /**
     * init
     * クチコミ一覧を取得
     */
    useFetch(async () => {
      try {
        await db
          .collection('classes')
          .doc(classId)
          .collection('kuchikomis')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              kuchikomis.value.push(doc.data() as Kuchikomi)
            })
          })
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
    })

    return {
      classId,
      kuchikomis,
      uid,
      isOpenErrorSnackbar,
      isOpenUpdateDialog,
      openUpdateDialog,
      updateTargetId,
      isOpenDeleteConfirm,
      openDeleteConfirm,
      deleteKuchikomi,
      isOpenSuccessUpdateSnackbar,
      isOpenSuccessDeleteSnackbar
    }
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
