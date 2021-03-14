<template>
  <v-container id="create" class="pa-1">
    <v-row no-gutters justify="center">
      <v-col cols="12" lg="9">
        <div class="text-h6 d-flex justify-center mt-2 mb-6 font-weight-bold">
          新しい授業＋クチコミ新規作成
        </div>
        <v-form ref="form" v-model="isFormValid">
          <v-row no-gutters justify="center">
            <!-- 授業名 -->
            <v-col cols="10" md="5" class="mx-1">
              <TextCaption required title="授業名" />
              <TextInput
                v-model="classTitle"
                :rules="RULES.requiredWith30"
                :counter="30"
                placeholder="例： 自然と生命Ⅵ"
              />
            </v-col>
            <!-- 講師名 -->
            <v-col cols="10" md="5" class="mx-1">
              <TextCaption required title="講師名" />
              <TextInput
                v-model="teacherName"
                :rules="RULES.requiredWith20"
                :counter="20"
                placeholder="例： 都留 太郎"
                hint="(苗字と名前の間に半角スペースを入れてください)"
              />
            </v-col>
          </v-row>

          <v-row no-gutters justify="center">
            <!-- 受講した年 -->
            <v-col cols="10" class="mx-1">
              <TextCaption required title="受講した年" />
              <SelectInput
                v-model="year"
                :items="years"
                :rules="RULES.required"
              />
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <!-- おすすめ度 -->
            <v-col cols="10" class="mx-1">
              <TextCaption required title="おすすめ度(0.5~5)" />
              <div class="my-2 d-flex justify-start">
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
          <!-- 開講期 -->
          <!-- <v-col cols="5" class="mx-1">
              <TextCaption required title="開講期" />
              <SelectInput
                v-model="term"
                :items="TERMS"
                :rules="RULES.required"
              />
            </v-col> -->
          <!-- 時限 -->
          <!-- <v-col cols="5" class="mx-1">
              <TextCaption required title="時限" />
              <SelectInput
                v-model="period"
                :items="PERIODS"
                :rules="isTermShort ? [] : dayAndPeriodRule"
                :disabled="isTermShort"
                :placeholder="isTermShort ? '入力不要' : ''"
              />
            </v-col> -->

          <!-- 曜日 -->
          <!-- <v-row no-gutters justify="center">
            <v-col cols="5" class="mx-1">
              <TextCaption required title="曜日" />
              <SelectInput
                v-model="dayOfWeek"
                :items="DAYS"
                :rules="isTermShort ? [] : dayAndPeriodRule"
                :disabled="isTermShort"
                :placeholder="isTermShort ? '入力不要' : ''"
              />
            </v-col>
          </v-row> -->
          <!-- クチコミのタイトル -->
          <v-row no-gutters justify="center">
            <v-col cols="10">
              <TextCaption required title="クチコミのタイトル" />
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
              <TextCaption required title="クチコミの内容" />
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
          <AppBtn
            color="grey darken-2"
            class="mr-1"
            @click="isOpenResetConfirm = true"
          >
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
        @ok="createClassAndKuchikomi"
      />
      <ConfirmDialog
        v-model="isOpenResetConfirm"
        text="クリア"
        @ok="resetInput"
      />

      <!-- スナックバー -->
      <SnackBar
        v-model="isOpenSuccessSnackbar"
        text="【成功】クチコミを作成しました。ご協力ありがとうございます😊"
        color="success"
      />
      <SnackBar
        v-model="isOpenDuplicatedSnackbar"
        text="【エラー】この授業はすでに存在します。「作成」メニューの授業名の欄から探してください🙇‍♂️"
        color="error"
      />
      <SnackBar
        v-model="isOpenErrorSnackbar"
        text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢"
        color="error"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" async>
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { Class, Kuchikomi } from '@/types/State'
import db from '@/plugins/firebase'
import firebase from 'firebase'
import { suid } from 'rand-token'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です'],
  requiredWith20: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length <= 20) || '20文字以下で記入してください'
  ],
  requiredWith30: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length <= 30) || '30文字以下で記入してください'
  ],
  kuchikomi: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) =>
      (v && v.length <= 1000) || 'クチコミ内容は1000文字以下で記入してください'
  ]
} as const
const DAYS = ['月', '火', '水', '木', '金', '土', '日'] as const
const PERIODS = ['1', '2', '3', '4', '5', '6'] as const
const TERMS = ['前期', '後期', '通年', '時間外授業'] as const

export default defineComponent({
  name: 'create-new-class',
  setup(_, { root }) {
    const classTitle = ref('')
    const teacherName = ref('')
    const term = ref('')
    const dayOfWeek = ref('')
    const period = ref('')
    const rating = ref(0.5)
    const kuchikomiTitle = ref('')
    const kuchikomi = ref('')
    const year = ref('')
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように
    const isFormValid = ref(true)

    // 開講期が「時間外授業」の場合は「曜日・時限」を null にする
    const isTermShort = computed(() => term.value === '時間外授業')
    watch(isTermShort, () => {
      if (term.value === '時間外授業') {
        dayOfWeek.value = ''
        period.value = ''
      }
    })
    // 開講期が「時間外授業」の場合はルールを無くす
    const dayAndPeriodRule = [
      (v: string) =>
        term.value === '時間外授業' ? false : !!v || 'この欄の入力は必須です'
    ]

    const isOpenCreateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenDuplicatedSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)

    const openCreateConfirm = () => {
      isOpenCreateConfirm.value = true
      isOpenSuccessSnackbar.value = false
      isOpenDuplicatedSnackbar.value = false
      isOpenErrorSnackbar.value = false
    }
    // 講義を追加
    const addClass = (
      docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    ): void => {
      if (csrfToken !== storedCsrfToken) {
        isOpenErrorSnackbar.value = true
        return
      }
      const data: Class = {
        docId: docRef.id,
        classTitle: classTitle.value,
        teacherName: teacherName.value,
        // term: term.value,
        // dayOfWeek: dayOfWeek.value,
        // period: period.value,
        createdBy: root.$store.getters.user.uid,
        createdAt: new Date().toLocaleString()
      }
      docRef.set(data)
      root.$store.dispatch('pushClass', data)
    }
    // クチコミを追加
    const addKuchikomi = (
      docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    ): void => {
      if (csrfToken !== storedCsrfToken) {
        isOpenErrorSnackbar.value = true
        return
      }
      const kuchikomiRef = db
        .collection('classes')
        .doc(docRef.id)
        .collection('kuchikomis')
        .doc()
      const data: Kuchikomi = {
        docId: kuchikomiRef.id,
        kuchikomiTitle: kuchikomiTitle.value,
        classYear: year.value,
        rating: rating.value,
        kuchikomi: kuchikomi.value,
        uid: root.$store.getters.user.uid,
        username: root.$store.getters.user.username,
        createdAt: new Date().toLocaleString()
      }
      kuchikomiRef.set(data)
    }
    // 授業＋クチコミ作成
    const createClassAndKuchikomi = (): void => {
      if (csrfToken !== storedCsrfToken) {
        isOpenErrorSnackbar.value = true
        return
      }
      // 入力した授業と同じ授業名かつ講師名が存在するかのフラグ
      const isTitleAndTeacherNameSame = classList.value.find(
        (item) =>
          item.classTitle === classTitle.value &&
          item.teacherName === teacherName.value
      )

      if (!isTitleAndTeacherNameSame) {
        const docRef = db.collection('classes').doc()
        try {
          Promise.all([addClass(docRef), addKuchikomi(docRef)])
          resetInput()
          isOpenCreateConfirm.value = false
          isOpenSuccessSnackbar.value = true
        } catch (e) {
          console.error('create-new', e)
          isOpenErrorSnackbar.value = true
          isOpenCreateConfirm.value = false
        }
      } else if (isTitleAndTeacherNameSame) {
        isOpenCreateConfirm.value = false
        isOpenDuplicatedSnackbar.value = true
      } else {
        isOpenCreateConfirm.value = false
        isOpenErrorSnackbar.value = true
      }
    }

    // リセット
    const form = ref(null)
    const isOpenResetConfirm = ref(false)
    const resetInput = (): void => {
      classTitle.value = ''
      teacherName.value = ''
      dayOfWeek.value = ''
      period.value = ''
      year.value = ''
      term.value = ''
      rating.value = 0.5
      kuchikomiTitle.value = ''
      kuchikomi.value = ''
      // @ts-ignore "Object is possibly null" エラーをignore
      form.value.resetValidation()
      isOpenResetConfirm.value = false
    }

    /**
     * init
     */
    // 授業のタイトルの配列を作成
    const classList = ref<Class[]>([])
    classList.value = root.$store.getters.classes
    const classTitles = ref<String[]>([])
    classList.value.forEach((item) => {
      classTitles.value.push(item.classTitle)
    })
    const csrfToken = suid(16)
    root.$store.dispatch('setCsrfToken', csrfToken)
    const storedCsrfToken = root.$store.getters.csrfToken

    return {
      RULES,
      dayAndPeriodRule,
      DAYS,
      PERIODS,
      TERMS,
      classList,
      classTitle,
      classTitles,
      teacherName,
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
      isFormValid,
      createClassAndKuchikomi,
      isOpenSuccessSnackbar,
      isOpenDuplicatedSnackbar,
      isOpenErrorSnackbar,
      isOpenResetConfirm,
      resetInput,
      form,
      addClass,
      openCreateConfirm,
      csrfToken,
      storedCsrfToken
    }
  }
})
</script>

<style scoped>
#create {
  margin-top: 4rem;
}
</style>
