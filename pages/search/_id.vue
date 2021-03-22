<template>
  <div v-if="$fetchState.pending" class="loading">
    <v-progress-circular indeterminate size="100" width="6" color="primary" />
  </div>
  <!-- クチコミ一覧 -->
  <v-container v-else class="pt-15 px-2">
    <v-row no-gutters justify="center" align="center" class="body">
      <v-col cols="12" lg="9">
        <!-- クチコミが存在しない場合 -->
        <div v-if="!kuchikomiList.length" class="text-center">
          <div class="my-3 mx-1 d-flex justify-center text-h6 font-weight-bold">
            「{{ currentClass.classTitle }}」 のクチコミはありません
          </div>
          <div class="px-3 grey--text">
            もしこの授業を受けたことがあれば、最初のクチコミ作成者になりませんか？
          </div>
          <div class="d-flex justify-center py-3">
            <AppBtn
              depressed
              color="primary"
              width="12rem"
              class="text-caption"
              @click="goToCreatePage"
              ><v-icon small class="pr-1"> mdi-pencil-plus-outline </v-icon
              >最初のクチコミを作成</AppBtn
            >
          </div>
        </div>

        <!-- クチコミが存在する場合 -->
        <v-row v-else-if="kuchikomiList.length" no-gutters>
          <v-col cols="12">
            <div
              class="my-3 mx-1 d-flex justify-center text-h6 font-weight-bold"
            >
              {{ currentClass.classTitle }}
            </div>
            <div class="d-flex justify-center pb-1">
              <AppBtn
                depressed
                color="primary"
                width="12rem"
                class="text-caption"
                @click="goToCreatePage"
                ><v-icon small> mdi-pencil-plus-outline </v-icon
                >この授業のクチコミを作成</AppBtn
              >
            </div>
          </v-col>
          <v-col cols="12">
            <v-card
              v-for="item in kuchikomiList"
              :key="item.docId"
              class="card my-2"
              rounded
              outlined
            >
              <!-- アイコン＋ユーザー名 -->
              <div class="d-flex mx-1 mt-2">
                <!-- TODO: プロフィール画像  -->
                <!-- <v-img :src="getUserPhotoURL" /> -->
                <v-icon color="primary lighten-1"> mdi-account-circle </v-icon>
                <div class="text-body-2 pa-1">
                  {{ getUsername(item.uid) }}
                </div>
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
                  {{ item.kuchikomiTitle }}
                </div>
              </div>
              <!-- 受講年 -->
              <div class="text-caption text--disabled mx-2">
                受講した年: {{ item.classYear }} 年
              </div>
              <!-- クチコミの内容 -->
              <div class="d-flex pa-2 text-body-1">
                {{ item.kuchikomi }}
              </div>
              <!-- 編集・削除ボタン -->
              <div v-if="uid === item.uid" class="buttons">
                <v-btn fab icon small @click="openUpdateDialog(item)">
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
        <EditDialog
          v-model="isOpenUpdateDialog"
          :updating-kuchikomi="updatingKuchikomi"
          @updated="updateKuchikomi($event)"
          @cancel="cancelUpdate"
        />
        <ConfirmDialog
          v-model="isOpenDeleteConfirm"
          text="delete"
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

<script lang="ts" async>
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { Kuchikomi, User, Class } from '@/types/State'

export default defineComponent({
  name: 'SearchId',
  setup(_, { root }) {
    const uid = ref(root.$store.getters.user.uid)
    const classId = root.$route.params.id
    const isOpenSuccessUpdateSnackbar = ref(false)
    const isOpenSuccessDeleteSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const isOpenUpdateDialog = ref(false)
    const isOpenDeleteConfirm = ref(false)

    // クチコミ作成ページへ遷移
    const goToCreatePage = () => {
      root.$store.dispatch('setCurrentClass', currentClass)
      root.$router.push('/create')
    }

    // 編集
    const updatingKuchikomi = ref({})
    const originalKuchikomi = ref({})
    const openUpdateDialog = (kuchikomi: Kuchikomi): void => {
      // 編集するクチコミ情報のコピーを作成
      originalKuchikomi.value = Object.assign({}, kuchikomi)
      updatingKuchikomi.value = Object.assign({}, kuchikomi)
      isOpenUpdateDialog.value = true
      // スナックバーの開閉状態は一度初期化しておく必要有り
      isOpenSuccessUpdateSnackbar.value = false
      isOpenSuccessDeleteSnackbar.value = false
      isOpenErrorSnackbar.value = false
    }
    // 更新された内容を一覧に反映させる処理
    const updateKuchikomi = (updatedKuchikomi: Kuchikomi): void => {
      isOpenUpdateDialog.value = false
      const docId = updatedKuchikomi.docId
      const targetIndex = kuchikomiList.value.findIndex(
        (item) => item.docId === docId
      )
      kuchikomiList.value[targetIndex] = updatedKuchikomi
    }
    const cancelUpdate = (): void => {
      updatingKuchikomi.value = originalKuchikomi.value
      isOpenUpdateDialog.value = false
    }

    // 削除
    const deleteTargetId = ref('')
    const openDeleteConfirm = (docId: string): void => {
      isOpenDeleteConfirm.value = true
      isOpenSuccessUpdateSnackbar.value = false
      isOpenSuccessDeleteSnackbar.value = false
      isOpenErrorSnackbar.value = false
      deleteTargetId.value = docId
    }
    // 削除処理
    const deleteKuchikomi = async (): Promise<void> => {
      try {
        await db // 削除
          .collection('classes')
          .doc(classId)
          .collection('kuchikomis')
          .doc(deleteTargetId.value)
          .delete()
        // 削除後のクチコミ全てをFirestoreから取得 -> クチコミ一覧を上書き
        const newKuchikoims: Kuchikomi[] = []
        await db
          .collection('classes')
          .doc(classId)
          .collection('kuchikomis')
          .get()
          .then((querysnapshot): void => {
            querysnapshot.forEach((doc) => {
              newKuchikoims.push(doc.data() as Kuchikomi)
            })
          })
        kuchikomiList.value = newKuchikoims // 上書き
        isOpenDeleteConfirm.value = false
        isOpenSuccessDeleteSnackbar.value = true
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
    }

    /**
     * init
     */
    // ユーザーネーム取得
    const getUsername = (uid: string): string => {
      const users: User[] = root.$store.getters.users
      const username = users.find((user) => user.uid === uid)?.username
      return username || '名無しのユーザー'
    }
    // 現在選択されている授業取得
    const classList: Class[] = root.$store.getters.classes
    const currentClass = classList.find((item) => item.docId === classId)
    // TODO: プロフィール画像
    // const getUserPhotoURL = (uid: string): ArrayBuffer | string => {
    //   const users: User[] = root.$store.getters.users
    //   const photoURL = users.find((item) => item.uid === uid)?.photoURL
    //   return (
    //     photoURL ||
    //     'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'
    //   )
    // }

    // クチコミの一覧を取得
    const kuchikomiList = ref<Kuchikomi[]>([])
    useFetch(
      async (): Promise<void> => {
        try {
          await db
            .collection('classes')
            .doc(classId)
            .collection('kuchikomis')
            .get()
            .then((querySnapshot): void => {
              querySnapshot.forEach((doc) => {
                kuchikomiList.value.push(doc.data() as Kuchikomi)
              })
            })
          uid.value = root.$store.getters.user.uid
        } catch (e) {
          console.error(e)
          isOpenErrorSnackbar.value = true
        }
      }
    )

    return {
      classId,
      kuchikomiList,
      uid,
      goToCreatePage,
      isOpenErrorSnackbar,
      isOpenUpdateDialog,
      openUpdateDialog,
      cancelUpdate,
      updatingKuchikomi,
      isOpenDeleteConfirm,
      openDeleteConfirm,
      deleteKuchikomi,
      isOpenSuccessUpdateSnackbar,
      isOpenSuccessDeleteSnackbar,
      originalKuchikomi,
      updateKuchikomi,
      getUsername,
      currentClass
      // getUserPhotoURL
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
.body {
  margin: auto;
}
</style>
