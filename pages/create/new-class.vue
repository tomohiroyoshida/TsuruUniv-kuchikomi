<template>
  <v-container id="create" fluid class="pa-1">
    <v-row no-gutters justify="center">
      <v-col ref="form" cols="12" md="9">
        <div class="text-h6 d-flex justify-center mt-4 mb-2">
          新しい授業とクチコミを作成
        </div>
        <v-row no-gutters justify="center">
          <!-- 授業名 -->
          <v-col cols="12" md="6">
            <RequiredCaption title="授業名" />
            <TextInput
              v-model="title"
              :rules="RULES.requiredWith30"
              :counter="30"
              placeholder="例： 自然と生命Ⅵ"
            />
          </v-col>
          <!-- 講師名 -->
          <v-col cols="12" md="6">
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
          <!-- 曜日 -->
          <v-col cols="6">
            <RequiredCaption title="曜日" />
            <v-select
              v-model="dayOfWeek"
              :items="DAYS"
              :rules="RULES.required"
              flat
              dense
              solo
              rounded
              outlined
              clearable
              color="primary"
            />
          </v-col>
          <!-- 限目 -->
          <v-col cols="6">
            <RequiredCaption title="限目" />
            <v-select
              v-model="period"
              :items="PERIODS"
              :rules="RULES.required"
              flat
              solo
              dense
              rounded
              outlined
              clearable
              color="primary"
            />
          </v-col>
        </v-row>

        <v-row no-gutters justify="center">
          <!-- 受講した年 -->
          <v-col cols="6">
            <RequiredCaption title="受講した年" />
            <v-select
              v-model="year"
              :items="years"
              :rules="RULES.required"
              flat
              dense
              solo
              rounded
              outlined
              clearable
              color="primary"
            />
          </v-col>
          <!-- 評価 -->
          <v-col cols="6">
            <RequiredCaption title="評価(0.5~5)" />
            <div class="my-2 d-flex justify-center">
              <v-rating
                v-model="rating"
                dense
                half-increments
                color="warning"
                background-color="grey lighten-1"
              />
              <div class="mx-2 my-1">({{ rating }})</div>
            </div>
          </v-col>
        </v-row>

        <!-- タイトル -->
        <RequiredCaption title="クチコミのタイトル" />
        <TextInput
          v-model="kuchikomiTitle"
          :rules="RULES.requiredWith20"
          :counter="20"
          placeholder="例： おすすめの授業です"
        />
        <!-- クチコミ -->
        <RequiredCaption title="クチコミの内容" />
        <TextareaInput
          v-model="kuchikomi"
          :rules="RULES.kuchikomi"
          placeholder="例： 授業も面白いし先生も優しいです！ ただテストは難しいので要対策です！"
        />

        <!-- 送信・キャンセルボタン -->
        <div class="d-flex justify-center py-3">
          <AppBtn
            outlined
            color="grey darken-2"
            class="mr-2"
            @click="openResetConfirm"
          >
            リセット
          </AppBtn>
          <AppBtn
            depressed
            color="primary"
            :disabled="disabled"
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
        @cancel="isOpenCreateConfirm = false"
      />
      <ConfirmDialog
        v-model="isOpenResetConfirm"
        text="リセット"
        @ok="resetInput"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'

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
      (v && v.length < 1000) ||
      'クチコミ内容は１０００文字以下で記入してください'
  ]
} as const
const DAYS = ['月', '火', '水', '木', '金', '土', '日', '短期集中科目'] as const
const PERIODS = ['1', '2', '3', '4', '5', '6', '短期集中科目'] as const

export default defineComponent({
  name: 'create',
  setup(_, { root }) {
    const title = ref('')
    const teacher = ref('')
    const dayOfWeek = ref('')
    const period = ref('')
    const kuchikomiTitle = ref('')
    const kuchikomi = ref('')
    const year = ref('')
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように
    const rating = ref<Number>(0.5)

    // 作成
    const isOpenCreateConfirm = ref(false)
    const openCreateConfirm = () => {
      isOpenCreateConfirm.value = true
    }
    const disabled = computed(() => {})
    // console.debug('rerfs', root.$refs.form.validate())
    // TODO
    const createKuchikomi = () => {
      isOpenCreateConfirm.value = false
    }

    // キャンセル
    const isOpenResetConfirm = ref(false)
    const openResetConfirm = () => {
      isOpenResetConfirm.value = true
    }
    const resetInput = () => {
      isOpenResetConfirm.value = false
      title.value = ''
      teacher.value = ''
      dayOfWeek.value = ''
      period.value = ''
      year.value = ''
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
      DAYS,
      PERIODS,
      fetchedClasses,
      title,
      classTitles,
      teacher,
      dayOfWeek,
      period,
      kuchikomiTitle,
      kuchikomi,
      year,
      years,
      rating,
      isOpenCreateConfirm,
      openCreateConfirm,
      disabled,
      createKuchikomi,
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
