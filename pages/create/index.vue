<template>
  <v-container id="create" fluid class="pa-0">
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <div class="text-h6 d-flex justify-center my-5 font-weight-bold">
          クチコミを新規作成
        </div>
        <v-form ref="form" v-model="isFormValid">
          <v-row no-gutters justify="center">
            <!-- 授業名 -->
            <v-col cols="10">
              <TextCaption required class="my-1">
                授業名 (見つからない場合は
                <nuxt-link to="/create/new-class">こちらから新規作成</nuxt-link
                >)
              </TextCaption>
              <v-autocomplete
                v-model="title"
                :items="classTitles"
                :rules="RULES.required"
                flat
                solo
                dense
                outlined
                clearable
                cache-items
                hide-no-data
                item-color="primary"
                color="primary"
                label="授業名を入力 選択"
                persistent-hint
                @input="showCard($event)"
              />
            </v-col>
          </v-row>

          <!--  授業の情報 -->
          <v-row v-if="title" no-gutters justify="center">
            <v-col cols="10">
              <div class="required-caption text-caption my-1 ml-3">
                授業の情報
              </div>
              <v-card v-if="hasCardInfo" rounded outlined>
                <v-card-title>{{ title }}</v-card-title>
                <v-card-subtitle>
                  講師: {{ classCardInfo.teacher }}
                </v-card-subtitle>
                <v-card-text>
                  {{ classCardInfo.dayOfWeek }}曜 {{ classCardInfo.period }}限
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- 受講した年 -->
          <v-row no-gutters justify="center">
            <v-col cols="10">
              <TextCaption required title="受講した年" />
              <SelectInput
                v-model="year"
                :items="years"
                :rules="RULES.required"
              />
            </v-col>
          </v-row>
          <!-- おすすめ度 -->
          <v-row no-gutters justify="center">
            <v-col cols="10">
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
          <!-- タイトル -->
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
          <AppBtn color="grey darken-2" class="mr-1" @click="openResetConfirm">
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
        v-model="isOpenErrorSnackbar"
        text="エラーが発生しました。画面をリロードしてもう一度試してください。"
        color="error"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'
import db from '@/plugins/firebase'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です'],
  teacher: [(v: string) => !!v || '講師名は必須です'],
  kuchikomi: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) =>
      (v && v.length < 1000) || 'クチコミ内容は1000文字以下で記入してください'
  ],
  requiredWith20: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length < 20) || '20文字以下で記入してください'
  ]
}

export default defineComponent({
  name: 'create',
  setup(_, { root }) {
    const title = ref('')
    const teacher = ref('')
    const isFormValid = ref(true)
    const rating = ref<Number>(0.5)
    const kuchikomiTitle = ref('')
    const kuchikomi = ref('')
    const year = ref(null)
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように
    const form = ref(null)
    // カード
    const hasCardInfo = ref(false)
    let classCardInfo = reactive<Class>({
      title: '',
      teacher: '',
      dayOfWeek: '',
      period: '',
      createdAt: null
    })
    const showCard = async (title: String) => {
      await fetchedClasses.value.filter((item) => {
        if (item.title === title) {
          classCardInfo = item
          hasCardInfo.value = true
        } else {
          hasCardInfo.value = false
        }
      })
    }

    // 作成
    const disabledSubmit = ref(true)
    const isOpenCreateConfirm = ref(false)
    const openCreateConfirm = () => {
      isOpenCreateConfirm.value = true
    }
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const createKuchikomi = async () => {
      disabledSubmit.value = false
      isOpenCreateConfirm.value = false

      const createdAt = new Date().toLocaleString()
      //  Firestoreにクチコミの情報追加
      const docRef = db
        .collection('classes')
        .doc(title.value)
        .collection('kuchikomis')
        .doc()
      try {
        await docRef.set({
          title: kuchikomiTitle.value,
          content: kuchikomi.value,
          rating: rating.value,
          year: year.value,
          createdAt,
          uid: root.$store.getters.user.uid,
          username: root.$store.getters.user.name,
          email: root.$store.getters.user.email,
          docId: docRef.id
        })
        isOpenSuccessSnackbar.value = true
        disabledSubmit.value = false
        resetInput()
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
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
      year.value = null
      rating.value = 0.5
      kuchikomiTitle.value = ''
      kuchikomi.value = ''
      form?.value.resetValidation()
      console.debug('ref', root.$refs)
    }

    /**
     * init
     */
    const classTitles = ref<String[]>([])
    const fetchedClasses = ref<Class[]>([])
    fetchedClasses.value = root.$store.getters.classes

    // 授業のタイトルの配列を作成
    fetchedClasses.value.forEach((item) => {
      classTitles.value.push(item.title)
    })

    return {
      RULES,
      isFormValid,
      rating,
      kuchikomiTitle,
      kuchikomi,
      year,
      years,
      fetchedClasses,
      title,
      classTitles,
      teacher,
      isOpenSuccessSnackbar,
      isOpenErrorSnackbar,
      openResetConfirm,
      resetInput,
      openCreateConfirm,
      createKuchikomi,
      isOpenCreateConfirm,
      isOpenResetConfirm,
      showCard,
      hasCardInfo,
      classCardInfo,
      disabledSubmit,
      form
    }
  }
})
</script>

<style scoped>
#create {
  margin-top: 3rem;
}
</style>
