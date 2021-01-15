<template>
  <v-container id="create" fluid class="pa-1">
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <div class="text-h6 d-flex justify-center my-3">
          新しい授業とクチコミを作成
        </div>
        <v-form ref="form" v-model="isFormValid">
          <v-row no-gutters justify="center">
            <!-- 授業名 -->
            <v-col cols="10" class="mx-1">
              <RequiredCaption title="授業名" />
              <TextInput
                v-model="title"
                :rules="RULES.requiredWith30"
                :counter="30"
                placeholder="例： 自然と生命Ⅵ"
              />
            </v-col>
            <!-- 講師名 -->
            <v-col cols="10" class="mx-1">
              <RequiredCaption title="講師名" />
              <TextInput
                v-model="teacher"
                :rules="RULES.requiredWith20"
                :counter="20"
                placeholder="例： 都留 太郎"
              />
            </v-col>
          </v-row>

          <v-row no-gutters justify="center">
            <!-- 開講期 -->
            <v-col cols="5" class="mx-1">
              <RequiredCaption title="開講期" />
              <SelectInput
                v-model="term"
                :items="TERMS"
                :rules="RULES.required"
              />
            </v-col>
            <!-- 受講した年 -->
            <v-col cols="5" class="mx-1">
              <RequiredCaption title="受講した年" />
              <SelectInput
                v-model="year"
                :items="years"
                :rules="RULES.required"
              />
            </v-col>
          </v-row>

          <v-row no-gutters justify="center">
            <!-- 曜日 -->
            <v-col cols="5" class="mx-1">
              <RequiredCaption title="曜日" />
              <SelectInput
                v-model="dayOfWeek"
                :items="DAYS"
                :rules="isTermShort ? [] : dayAndPeriodRule"
                :disabled="isTermShort"
                :placeholder="isTermShort ? '入力不要' : ''"
              />
            </v-col>
            <!-- 時限 -->
            <v-col cols="5" class="mx-1">
              <RequiredCaption title="時限" />
              <SelectInput
                v-model="period"
                :items="PERIODS"
                :rules="isTermShort ? [] : dayAndPeriodRule"
                :disabled="isTermShort"
                :placeholder="isTermShort ? '入力不要' : ''"
              />
            </v-col>
          </v-row>

          <!-- 評価 -->
          <v-row no-gutters justify="center">
            <v-col cols="10">
              <RequiredCaption title="評価(0.5~5)" />
              <div class="ml-2 my-2 d-flex justify-start">
                <v-rating
                  v-model="rating"
                  half-increments
                  color="warning"
                  background-color="grey lighten-1"
                />
                <div class="ml-5 my-2">({{ rating }})</div>
              </div>
            </v-col>
          </v-row>

          <!-- タイトル -->
          <v-row no-gutters justify="center">
            <v-col cols="10">
              <RequiredCaption title="クチコミのタイトル" />
              <TextInput
                v-model="kuchikomiTitle"
                :rules="RULES.requiredWith20"
                :counter="20"
                placeholder="例： おすすめの授業です"
              />
            </v-col>
          </v-row>
          <!-- クチコミ -->
          <v-row no-gutters justify="center">
            <v-col cols="10">
              <RequiredCaption title="クチコミの内容" />
              <TextareaInput
                v-model="kuchikomi"
                :rules="RULES.kuchikomi"
                placeholder="例： 授業も面白いし先生も優しいです！ ただテストは難しいので要対策です！"
              />
            </v-col>
          </v-row>
        </v-form>

        <!-- 送信・キャンセルボタン -->
        <div class="d-flex justify-center py-3">
          <AppBtn color="grey darken-2" class="mr-2" @click="openResetConfirm">
            リセット
          </AppBtn>
          <AppBtn
            color="primary"
            depressed
            :disabled="!isFormValid"
            @click="openCreateConfirm"
          >
            作成
          </AppBtn>
        </div>
      </v-col>
      <!-- 確認ダイアログ -->
      <ConfirmDialog
        v-model="isOpenCreateConfirm"
        text="作成"
        @ok="createKuchikomi"
      />
      <ConfirmDialog
        v-model="isOpenResetConfirm"
        text="リセット"
        @ok="resetInput"
      />

      <!-- スナックバー -->
      <SnackBar
        v-model="isOpenSuccessSnackbar"
        text="作成に成功しました"
        color="success"
      />
      <SnackBar
        v-model="isOpenDuplicatedSnackbar"
        text="この授業名はすでに存在します。メニュー「クチコミを作成」からクチコミを作成してください。"
        color="error"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'
import db from '@/plugins/firebase'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です'],
  requiredWith20: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length < 20) || '20文字以下で記入してください'
  ],
  requiredWith30: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length < 30) || '30文字以下で記入してください'
  ],
  kuchikomi: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) =>
      (v && v.length < 1000) || 'クチコミ内容は1000文字以下で記入してください'
  ]
} as const
const DAYS = ['月', '火', '水', '木', '金', '土', '日'] as const
const PERIODS = ['1', '2', '3', '4', '5', '6'] as const
const TERMS = ['前期', '後期', '通年', '時間外授業'] as const

export default defineComponent({
  name: 'create',
  setup(_, { root }) {
    const title = ref('')
    const teacher = ref('')
    const term = ref(null)
    const dayOfWeek = ref(null)
    const period = ref(null)
    const rating = ref<Number>(0.5)
    const kuchikomiTitle = ref('')
    const kuchikomi = ref('')
    const year = ref(null)
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように
    const isFormValid = ref(true)

    // 開講期が「時間外授業」の場合は「曜日・時限」を null にする
    const isTermShort = computed(() => term.value === '時間外授業')
    watch(isTermShort, () => {
      if (term.value === '時間外授業') {
        dayOfWeek.value = null
        period.value = null
      }
    })
    // 開講期が「時間外授業」の場合はルールを無くす
    const dayAndPeriodRule = [
      (v: string) =>
        term.value === '時間外授業' ? false : !!v || 'この欄の入力は必須です'
    ]

    // 新規作成
    const isOpenCreateConfirm = ref(false)
    const openCreateConfirm = () => {
      isOpenCreateConfirm.value = true
    }
    const isOpenSuccessSnackbar = ref(false)
    const isOpenDuplicatedSnackbar = ref(false)

    const createKuchikomi = async () => {
      isOpenCreateConfirm.value = false
      const createdAt = new Date().toLocaleString()
      //  Firestoreに追加
      await db
        .collection('classes')
        .doc(title.value)
        .get()
        .then((doc) => {
          // もしすでに入力されたタイトルの授業が存在していたら処理を中止してエラーを出す
          if (doc.exists) {
            isOpenDuplicatedSnackbar.value = true
          } else {
            // 授業の情報を追加
            db.collection('classes')
              .doc(title.value)
              .set({
                title: title.value,
                teacher: teacher.value,
                term: term.value,
                dayOfWeek: dayOfWeek.value ? dayOfWeek.value : '',
                period: period.value ? period.value : '',
                createdAt
              })
            // クチコミの情報追加
            db.collection('classes')
              .doc(title.value)
              .collection('kuchikomis')
              .doc()
              .set({
                title: kuchikomiTitle.value,
                content: kuchikomi.value,
                rating: rating.value,
                year: year.value,
                username: root.$store.getters.user.username, // TODO: ログインしているユーザー名にする
                createdAt
              })
            isOpenSuccessSnackbar.value = true
            root.$router.replace('/create/')
          }
        })
    }

    // キャンセル
    const isOpenResetConfirm = ref(false)
    const openResetConfirm = () => {
      isOpenResetConfirm.value = true
    }
    // 記入内容を全てリセット
    const resetInput = () => {
      isOpenResetConfirm.value = false
      title.value = ''
      teacher.value = ''
      dayOfWeek.value = null
      period.value = null
      year.value = null
      term.value = null
      rating.value = 0.5
      kuchikomiTitle.value = ''
      kuchikomi.value = ''
    }

    /**
     * init
     */
    const classTitles = ref<String[]>([])
    const fetchedClasses = ref<Class[]>([])
    fetchedClasses.value = root.$store.getters.classes
    console.debug('fetchedClasses: ', fetchedClasses.value)

    // 授業のタイトルの配列を作成
    fetchedClasses.value.forEach((item) => {
      classTitles.value.push(item.title)
    })
    console.debug('titles:', classTitles.value)

    return {
      RULES,
      dayAndPeriodRule,
      DAYS,
      PERIODS,
      TERMS,
      fetchedClasses,
      title,
      classTitles,
      teacher,
      dayOfWeek,
      period,
      term,
      kuchikomiTitle,
      kuchikomi,
      year,
      years,
      rating,
      isTermShort,
      isOpenCreateConfirm,
      openCreateConfirm,
      isFormValid,
      createKuchikomi,
      isOpenSuccessSnackbar,
      isOpenDuplicatedSnackbar,
      isOpenResetConfirm,
      openResetConfirm,
      resetInput
    }
  }
})
</script>

<style scoped>
#create {
  margin-top: 4rem;
}
</style>
