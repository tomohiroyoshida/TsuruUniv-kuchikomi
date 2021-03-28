<template>
  <!-- ローディング -->
  <div v-if="isLoading" class="loading">
    <v-progress-circular indeterminate size="100" width="6" color="primary" />
  </div>
  <!-- プロフィール -->
  <v-container v-else class="pt-15 px-0">
    <v-row no-gutters justify="center" class="pt-3">
      <!-- プロフィール画像 -->
      <v-col cols="12" class="">
        <v-img :src="userData.photoURL" alt="ユーザー画像" class="image" />
      </v-col>
      <AppBtn
        v-if="userId === loggedinUser.uid"
        small
        rounded
        outlined
        color="primary"
        class="mt-3"
        @click="goToUpdateProfile"
      >
        プロフィールを編集
      </AppBtn>
      <!-- ユーザーネーム -->
      <v-col cols="11" class="pt-3 d-flex justify-center">
        <div class="text-h5 font-weight-bold">
          {{ userData.username }}
        </div>
      </v-col>
      <!-- Twitter -->
      <v-col cols="11" class="d-flex justify-center">
        <a
          v-if="userData.twitterURL"
          class="pl-2 pt-1"
          :href="userData.twitterURL"
          target="_blank"
        >
          <v-icon color="primary">mdi-twitter</v-icon>
        </a>
      </v-col>
      <!-- ユーザー情報 -->
      <v-col cols="11">
        <TextCaption title="ユーザー情報" />
        <v-card rounded outlined>
          <div class="pa-4">
            <div>
              学科：{{ getUserDepartment(userData.department) || '未登録' }}
            </div>
            <div>投稿したクチコミ数：{{ kuchikomisCount }}</div>
            <div>もらったいいね数：{{ likesCount }}</div>
          </div>
        </v-card>
      </v-col>

      <!-- ユーザーによるクチコミ一覧 -->
      <v-col cols="11" class="pt-3">
        <TextCaption :title="`${userData.username} さんのクチコミ一覧`" />
        <v-card
          v-for="item in kuchikomiList"
          :key="item.docId"
          class="card py-2 my-2"
          rounded
          outlined
        >
          <!-- 授業名 -->
          <div class="user-info">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div class="mx-1 mt-2" @click="goToKuchikomiPage(item.classId)">
                  <a class="pl-1" v-bind="attrs" v-on="on">
                    <span class="black--text font-weight-medium">
                      {{ item.classTitle }}
                    </span>
                  </a>
                </div>
              </template>
              <span>この授業のクチコミ一覧へ</span>
            </v-tooltip>
            <div class="text-body-2 pl-2">
              {{ item.classTeacherName }}
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { Kuchikomi, User } from '@/types/State'
import { Like } from '@/types/General'

const DEPARTMETS = [
  { text: '国文', value: 'japanese' },
  { text: '英文', value: 'english' },
  { text: '比文', value: 'comparativeCulture' },
  { text: '国教', value: 'globalEducation' },
  { text: '学教', value: 'teacherEducation' },
  { text: '地社', value: 'communitySociety' }
]

export default defineComponent({
  name: 'UserId',
  setup(_, { root }) {
    const isLoading = ref(false)

    const userId = root.$route.params.userId
    const loggedinUser: User = root.$store.getters.user
    const userData = ref<User>({
      uid: userId,
      username: '',
      photoURL: '',
      department: '',
      twitterURL: ''
    })
    const kuchikomisCount = ref(0)
    const likesCount = ref(0)

    const getUserDepartment = (value: string) => {
      return DEPARTMETS.find((item) => item.value === value)?.text
    }

    const goToKuchikomiPage = (classId: string) =>
      root.$router.push(`/search/${classId}`)

    const goToUpdateProfile = () => root.$router.push('/user')

    /**
     * init
     */
    const kuchikomiList = ref<Kuchikomi[]>([])
    useFetch(async () => {
      isLoading.value = true
      try {
        const userId = root.$route.params.userId
        // ユーザー情報取得
        const getUserData = await db
          .collection('users')
          .where('uid', '==', userId)
          .get()
          .then((snap) => {
            snap.forEach((doc) => (userData.value = doc.data() as User))
          })

        // ユーザーがもらった良いね数を取得
        const likesArr: any[] = []
        const getLikesCount = await db
          .collection('likes')
          .where('likeTo', '==', userId)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              likesArr.push(doc.data() as Like)
              likesCount.value = likesArr.length
            })
          })
        // このユーザーが作った全てのクチコミを取得
        const getKuchikomisByUser = await db
          .collection('kuchikomis')
          .where('uid', '==', userId)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              kuchikomiList.value.push(doc.data() as Kuchikomi)
              kuchikomisCount.value = kuchikomiList.value.length
            })
          })
        // 平行実行
        Promise.all([getUserData, getLikesCount, getKuchikomisByUser]).then(
          () => {
            isLoading.value = false
          }
        )
      } catch (e) {
        console.error(e)
      }
    })

    return {
      DEPARTMETS,
      isLoading,
      loggedinUser,
      userId,
      userData,
      getUserDepartment,
      likesCount,
      kuchikomisCount,
      kuchikomiList,
      goToKuchikomiPage,
      goToUpdateProfile
    }
  }
})
</script>

<style scoped>
/* ローディングアイコンを中央揃え */
.loading {
  margin: auto;
}
.body {
  margin: auto;
}
/* 画像 */
.image {
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  width: 80px;
  height: 80px;
  margin: auto;
}

/** ユーザーネーム */
.username {
  position: relative;
}
.twitter {
  position: absolute;
  top: -2px;
  right: -34px;
}

/** ユーザーの情報 */
.user-info {
  width: 300px;
  color: black;
}
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
