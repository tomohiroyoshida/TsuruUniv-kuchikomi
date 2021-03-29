<template>
  <div v-if="isLoading" class="loading">
    <v-progress-circular indeterminate size="100" width="6" color="primary" />
  </div>
  <!-- クチコミ一覧 -->
  <v-container v-else class="pt-15 px-2">
    <v-row no-gutters justify="center" align="center" class="body">
      <v-col cols="12" lg="9">
        <!-- クチコミが存在しない場合 -->
        <div v-if="!kuchikomiList.length" class="text-center">
          <div class="my-3 mx-1 d-flex justify-center text-h6 font-weight-bold">
            {{ currentClass.classTitle }} のクチコミはありません
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

          <!-- クチコミのカード -->
          <v-col cols="12">
            <v-card
              v-for="item in kuchikomiList"
              :key="item.docId"
              class="card my-2"
              rounded
              outlined
            >
              <!-- アイコン＋ユーザー名 -->
              <div class="user-info">
                <div
                  class="d-flex mx-1 mt-2"
                  @click.stop="goToUserPage(item.uid)"
                >
                  <!-- TODO: プロフィール画像  -->
                  <!-- <v-img :src="getUserPhotoURL()" class="image" /> -->
                  <v-icon color="primary"> mdi-account-circle </v-icon>
                  <a class="text-body-2 pa-1">
                    <span class="black--text">
                      {{ getUsername(item.uid) }}
                    </span>
                  </a>
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
                  color="star"
                  background-color="grey lighten-1"
                />
                <div class="text-subtitle-2 font-weight-bold px-2">
                  {{ item.kuchikomiTitle }}
                </div>
              </div>

              <!-- 受講年 -->
              <div class="text-caption text--disabled px-2">
                受講した年: {{ item.classYear }} 年
              </div>
              <!-- クチコミの内容 -->
              <div class="d-flex pa-2 text-body-1">
                {{ item.kuchikomi }}
              </div>
              <!-- 編集・削除ボタン -->
              <div v-if="uid === item.uid" class="buttons">
                <v-btn fab icon small @click="openUpdateDialog(item)">
                  <v-icon color="teal lighten-2">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn fab icon small @click="openDeleteConfirm(item.docId)">
                  <v-icon color="grey darken-2">mdi-trash-can-outline</v-icon>
                </v-btn>
              </div>
              <!-- いいねボタン -->
              <div class="d-flex justify-center">
                <v-icon
                  :id="item.docId"
                  class="likes-icon"
                  @click="clickHeart(item.docId)"
                  >mdi-heart-outline</v-icon
                >
                <div class="text-body-2 ml-2 mt-2">
                  {{ getLikesCount(item.docId) || 0 }}
                </div>
                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }"> </template>
                  <span>いいね</span>
                </v-tooltip> -->
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
          text="【成功】クチコミを編集しました👍"
          color="success"
        />
        <SnackBar
          v-model="isOpenSuccessDeleteSnackbar"
          text="【成功】クチコミを削除しました🗑"
          color="success"
        />
        <SnackBar
          v-model="isOpenErrorSnackbar"
          text="【エラー】エラーが起きました。ページをリロードしてもう一度試してください😢 直らない場合は運営に連絡してください🙇‍♂️"
          color="error"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" async>
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { Kuchikomi, User, Class } from '@/types/State'
import { Like } from '@/types/General'
import { setAvgRating } from '@/helpers/setAvgRating'
import { getNewDate } from '@/helpers/getNewDate'
import { KUCHIKOMI_TAGS } from '@/data/TAGS'

export default defineComponent({
  name: 'SearchId',
  setup(_, { root }) {
    const uid = ref<string>(root.$store.getters.user.uid)
    const classId = root.$route.params.id
    const isLoading = ref(false)
    const isOpenSuccessUpdateSnackbar = ref(false)
    const isOpenSuccessDeleteSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const isOpenUpdateDialog = ref(false)
    const isOpenDeleteConfirm = ref(false)

    // いいねの Map(クチコミID, いいねId)
    const likesMap = ref<Map<string, string>>(new Map())
    // いいねボタンを押す
    const clickHeart = async (kuchikomiId: string) => {
      const target = document.getElementById(kuchikomiId)
      if (target) {
        target.classList.toggle('liked')
      }
      // いいねが押されていれば追加・なければ削除
      if (target && target.className.includes('liked')) {
        const docRef = db.collection('likes').doc()
        const targetKuchikomiAuthorUid = kuchikomiList.value.find(
          (item) => item.docId === kuchikomiId
        )?.uid
        if (targetKuchikomiAuthorUid) {
          const input: Like = {
            docId: docRef.id,
            classId,
            kuchikomiId,
            likedBy: uid.value,
            likeTo: targetKuchikomiAuthorUid,
            createdAt: getNewDate()
          }
          likesList.value.push(input)
          likesMap.value.set(kuchikomiId, docRef.id)
          await docRef.set(input)
        }
      }
      // いいねを取り消す
      else if (target && !target.className.includes('liked')) {
        const targetLikeDocId = likesMap.value.get(kuchikomiId)
        const targetIndex = likesList.value.findIndex(
          (item) => item.docId === targetLikeDocId
        )
        // 授業の全いいねの中から該当のいいねを削除
        likesList.value.splice(targetIndex, 1)
        // firestoreから削除
        await db.collection('likes').doc(targetLikeDocId).delete()
      }
    }

    // 各クチコミのいいね数を取得
    const getLikesCount = (kuchikomiId: string) => {
      const count = likesList.value.filter(
        (item) => item.kuchikomiId === kuchikomiId
      )
      return count.length
    }
    // 自分がこのクチコミにいいねしたか
    const isLikedByMe = (kuchikomiId: string) => {
      const isKuchikomiLikedByMe = likedKuchikomisByMe.value.filter(
        (item) => item.kuchikomiId === kuchikomiId
      )
      return isKuchikomiLikedByMe[0]
    }

    const goToUserPage = (userId: string) => {
      root.$router.push(`/user/${userId}`)
    }

    // クチコミ作成ページへ遷移
    const goToCreatePage = () => {
      root.$store.dispatch('setCurrentClass', currentClass)
      root.$router.push('/create')
    }

    // 編集
    const updatingKuchikomi = ref({})
    const originalKuchikomi = ref({})
    const openUpdateDialog = (kuchikomi: Kuchikomi) => {
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
    const updateKuchikomi = (updatedKuchikomi: Kuchikomi) => {
      isOpenUpdateDialog.value = false
      const docId = updatedKuchikomi.docId
      const targetIndex = kuchikomiList.value.findIndex(
        (item) => item.docId === docId
      )
      kuchikomiList.value[targetIndex] = updatedKuchikomi
    }
    const cancelUpdate = () => {
      updatingKuchikomi.value = originalKuchikomi.value
      isOpenUpdateDialog.value = false
    }

    // 削除
    const deleteTargetDocId = ref('')
    const openDeleteConfirm = (docId: string) => {
      isOpenDeleteConfirm.value = true
      isOpenSuccessUpdateSnackbar.value = false
      isOpenSuccessDeleteSnackbar.value = false
      isOpenErrorSnackbar.value = false
      deleteTargetDocId.value = docId
    }
    // 削除処理
    const deleteKuchikomi = async () => {
      try {
        await db // 削除
          .collection('classes')
          .doc(classId)
          .collection('kuchikomis')
          .doc(deleteTargetDocId.value)
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

        // kuchikomis collection からクチコミ削除
        await db.collection('kuchikomis').doc(deleteTargetDocId.value).delete()

        // likes collection からクチコミにされたいいねを全て削除
        const likesArr: Like[] = []
        await db
          .collection('likes')
          .where('kuchikomiId', '==', deleteTargetDocId.value)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              likesArr.push(doc.data() as Like)
            })
          })
        likesArr.forEach(async (like) => {
          await db.collection('likes').doc(like.docId).delete()
        })

        setAvgRating(classId) // おすすめ度の平均値を更新
        kuchikomiList.value = newKuchikoims // クチコミの一覧を上書き
        isOpenDeleteConfirm.value = false
        isOpenSuccessDeleteSnackbar.value = true
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
    }

    // タグのテキストを表示
    const getTagData = (tag: string) => {
      return KUCHIKOMI_TAGS.find((item) => item.value === tag)
    }

    /**
     * init
     */
    // ユーザーネーム取得
    const getUsername = (uid: string) => {
      const users: User[] = root.$store.getters.users
      const username = users.find((user) => user.uid === uid)?.username
      return username || '名無しのユーザー'
    }
    // 現在選択されている授業取得
    const classList: Class[] = root.$store.getters.classes
    const currentClass = classList.find((item) => item.docId === classId)
    // TODO: プロフィール画像
    const getUserPhotoURL = (uid: string) => {
      const users: User[] = root.$store.getters.users
      const photoURL = users.find((item) => item.uid === uid)?.photoURL
      return (
        photoURL ||
        'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'
      )
    }

    // クチコミの一覧を取得
    const kuchikomiList = ref<Kuchikomi[]>([])
    // この授業に押された全いいね
    const likesList = ref<Like[]>([])
    // 自分がどれにいいねしたかのリスト
    const likedKuchikomisByMe = ref<Like[]>([])
    useFetch(async () => {
      isLoading.value = true
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
        // 全いいねのリストを取得
        await db
          .collection('likes')
          .where('classId', '==', classId)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => likesList.value.push(doc.data() as Like))
          })
        // // 自分がどれにいいねしたかのリスト
        likedKuchikomisByMe.value = likesList.value.filter(
          (item) => item.likedBy === uid.value
        )
        likedKuchikomisByMe.value.forEach((item) => {
          likesMap.value.set(item.kuchikomiId, item.docId)
        })
        // 自分がいいねしたハートはクリックされた状態にする
        await setTimeout(() => {
          kuchikomiList.value.forEach((item) => {
            if (isLikedByMe(item.docId)) {
              const target = document.getElementById(item.docId)
              if (target) target.classList.add('liked')
            }
          })
        }, 1)
        isLoading.value = false
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
    })

    return {
      KUCHIKOMI_TAGS,
      getTagData,
      classId,
      kuchikomiList,
      uid,
      goToCreatePage,
      goToUserPage,
      isLoading,
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
      currentClass,
      likesList,
      clickHeart,
      getLikesCount,
      isLikedByMe,
      likedKuchikomisByMe,
      likesMap,
      getUserPhotoURL
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

.image {
  width: 30px;
  height: 30px;
  transform: scale(0.5);
  border-radius: 50%;
}
/** ユーザーの情報 */
.user-info {
  width: 250px;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* ローディングアイコンを中央揃え */
.loading {
  margin: auto;
}
.body {
  margin: auto;
}

/* いいねボタンのアニメーション */
@keyframes heartAnimation {
  0% {
    transform: scale(0.7);
  }
  10% {
    transform: scale(0.5);
  }
  20% {
    transform: scale(0.7);
  }
  30% {
    transform: scale(0.9);
  }
  40% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  60% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1.4);
  }
  80% {
    transform: scale(1.3);
  }
  90% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.likes-icon {
  font-size: 25px;
}
.likes-icon.liked {
  /* heartAnimationアニメーションを200ミリ秒かけて実行する */
  animation: heartAnimation 0.2s;
  color: #e53935;
}
</style>
