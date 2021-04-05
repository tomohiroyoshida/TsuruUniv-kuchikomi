<template>
  <v-container id="create" class="pa-0">
    <v-row no-gutters justify="center">
      <v-col cols="12" lg="9">
        <div class="text-h6 d-flex justify-center my-5 font-weight-bold">
          クチコミ作成
        </div>
        <v-form ref="form" v-model="isFormValid">
          <v-row no-gutters justify="center">
            <!-- 授業名 -->
            <v-col cols="11">
              <TextCaption required>
                授業名 (見つからない場合は
                <nuxt-link to="/create/new-class"
                  >こちらから授業を作成</nuxt-link
                >)
              </TextCaption>
              <v-autocomplete
                v-model="selectedClassId"
                :items="autoCompleteClasses"
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
              />
            </v-col>
          </v-row>

          <!--  授業の情報の書かれたカード -->
          <v-row v-show="selectedClassId" no-gutters justify="center">
            <v-col cols="11">
              <TextCaption title="授業の情報" />
              <v-card rounded outlined>
                <v-card-title>{{ classCardInfo.classTitle }}</v-card-title>
                <v-card-subtitle>
                  講師: {{ classCardInfo.teacherName }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>

          <!-- 受講した年 -->
          <v-row no-gutters justify="center">
            <v-col cols="11">
              <TextCaption required title="受講した年" />
              <SelectInput
                v-model="classYear"
                :items="years"
                :rules="RULES.required"
              />
            </v-col>
          </v-row>
          <!-- おすすめ度 -->
          <v-row no-gutters justify="center">
            <v-col cols="11">
              <TextCaption required title="おすすめ度(0.5~5)" />
              <div class="my-2 d-flex justify-start">
                <v-rating
                  v-model="rating"
                  half-increments
                  color="star"
                  background-color="grey lighten-1"
                />
                <div class="ml-5 my-2">({{ rating }})</div>
              </div>
            </v-col>
          </v-row>
          <!-- タイトル -->
          <v-row no-gutters justify="center">
            <v-col cols="11">
              <TextCaption required title="クチコミのタイトル" />
              <TextInput
                v-model="kuchikomiTitle"
                :rules="RULES.requiredWith30"
                :counter="30"
                placeholder="例： おすすめの授業です"
              />
            </v-col>
          </v-row>
          <!-- クチコミ -->
          <v-row no-gutters justify="center">
            <v-col cols="11">
              <TextCaption required title="クチコミの内容" />
              <TextareaInput
                v-model="kuchikomi"
                :rules="RULES.kuchikomi"
                placeholder="例： 授業も面白いし先生も優しいです。 ただテストは難しいので要対策です！"
              />
            </v-col>
          </v-row>
        </v-form>

        <!-- 送信・キャンセルボタン -->
        <div class="d-flex justify-center py-3">
          <AppBtn
            color="grey darken-2"
            class="mr-1"
            :disabled="disabled"
            @click="isOpenResetConfirm = true"
          >
            リセット
          </AppBtn>
          <AppBtn
            color="primary"
            depressed
            :disabled="!isFormValid || disabled"
            @click="openCreateConfirm"
          >
            作成
          </AppBtn>
        </div>
      </v-col>

      <!-- 確認ダイアログ -->
      <KuchikomiConfirm
        v-model="isOpenCreateConfirm"
        :input="kuchikomiInput"
        type="createKuchikomi"
        @ok="createKuchikomi"
      />
      <ConfirmDialog
        v-model="isOpenResetConfirm"
        text="reset"
        @ok="resetInput"
      />

      <!-- スナックバー -->
      <SnackBar
        v-model="isOpenSuccessSnackbar"
        text="【成功】クチコミを作成しました!ご協力ありがとうございます😊"
        color="success"
      />
      <SnackBar
        v-model="isOpenErrorSnackbar"
        text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢 直らない場合は運営に連絡してください🙇‍♂️"
        color="error"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" async>
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'
import { db } from '@/plugins/firebase'
import { CollKuchikomi, User } from 'types/State'
import { KUCHIKOMI_TAGS } from '@/data/TAGS'
import { setAvgRating } from '@/helpers/setAvgRating'
import { getNewDate } from '@/helpers/getNewDate'
import { suid } from 'rand-token'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です'],
  kuchikomi: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) =>
      (v && v.length <= 1000) || 'クチコミ内容は1000文字以下で記入してください'
  ],
  requiredWith30: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length <= 30) || '30文字以下で記入してください'
  ]
} as const
interface CurrentClass {
  docId: string
  classTitle: string
  teacherName: string
  createdBy: string
  createdAt: string
}

export default defineComponent({
  name: 'create',
  setup(_, { root }) {
    const teacher = ref('')
    const isFormValid = ref(true)
    const selectedTags = ref([])
    const rating = ref(0.5)
    const kuchikomiTitle = ref('')
    const kuchikomi = ref('')
    const classYear = ref('')
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように
    const disabled = ref(false)

    // 授業情報のカード
    // Vuex Storeにある currentClass のデータ
    const currentClass: CurrentClass = Object.assign(
      {},
      root.$store.getters.currentClass
    )
    const selectedClassId = ref(currentClass.docId || '')
    // 選択された授業名を監視
    watch(selectedClassId, (classId: string) => {
      classList.value.find((item) =>
        item.docId === classId ? (classCardInfo.value = item) : ''
      )
    })

    const classCardInfo = ref({
      docId: currentClass.docId || selectedClassId.value,
      classTitle: currentClass.classTitle || '',
      teacherName: currentClass.teacherName || '',
      createdAt: currentClass.createdAt || '',
      createdBy: currentClass.createdBy || ''
    })

    // クチコミ作成
    const isOpenCreateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const kuchikomiInput = ref({})
    const openCreateConfirm = () => {
      kuchikomiInput.value = {
        classTitle: classCardInfo.value.classTitle,
        teacherName: classCardInfo.value.teacherName,
        classYear: classYear.value,
        rating: rating.value,
        kuchikomiTitle: kuchikomiTitle.value,
        kuchikomi: kuchikomi.value
      }
      isOpenCreateConfirm.value = true
      isOpenSuccessSnackbar.value = false
      isOpenErrorSnackbar.value = false
    }
    const createKuchikomi = async (): Promise<void> => {
      disabled.value = true
      if (csrfToken !== storedCsrfToken) {
        isOpenErrorSnackbar.value = true
        return
      }

      isOpenCreateConfirm.value = false
      // kuchikomis collection に追加
      try {
        const kuchikomiDocRef = db.collection('kuchikomis').doc()
        const storeUser = ref<User>(root.$store.getters.user)
        const collectionData: CollKuchikomi = {
          docId: kuchikomiDocRef.id,
          rating: rating.value,
          classYear: classYear.value,
          kuchikomiTitle: kuchikomiTitle.value,
          kuchikomi: kuchikomi.value,
          uid: storeUser.value.uid,
          username: storeUser.value.username,
          classId: classCardInfo.value.docId,
          classTitle: classCardInfo.value.classTitle,
          classTeacherName: classCardInfo.value.teacherName,
          createdAt: getNewDate()
        }
        await db
          .collection('kuchikomis')
          .doc(collectionData.docId)
          .set(collectionData)
        await setAvgRating(selectedClassId.value) // おすすめ度の平均値を更新
        resetInput()
        isOpenSuccessSnackbar.value = true
        emptyCurrentClass()
        disabled.value = false
      } catch (e) {
        console.error('create', e)
        isOpenErrorSnackbar.value = true
        disabled.value = false
      }
    }

    // キャンセル
    const isOpenResetConfirm = ref(false)
    // 記入内容を全てリセット
    const form = ref(null)
    const resetInput = () => {
      isOpenResetConfirm.value = false
      selectedClassId.value = ''
      classYear.value = ''
      rating.value = 0.5
      kuchikomiTitle.value = ''
      kuchikomi.value = ''
      // @ts-ignore "Object is possibly null" エラーをignore
      form.value.resetValidation()
    }
    // Store の currentClass を空にする
    const emptyCurrentClass = () => {
      const emptyClass = {
        docId: '',
        classTitle: '',
        teacherName: '',
        createdBy: '',
        createdAt: ''
      }
      root.$store.dispatch('setCurrentClass', emptyClass)
    }

    /**
     * init
     */
    // 授業のリスト
    const csrfToken = suid(16)
    root.$store.dispatch('setCsrfToken', csrfToken)
    const storedCsrfToken = root.$store.getters.csrfToken
    const classList = ref<Class[]>([])
    classList.value = root.$store.getters.classes

    // 授業のタイトルの配列を作成
    interface AutocompleteClasses {
      text: string
      value: string
    }
    const autoCompleteClasses = ref<AutocompleteClasses[]>([])
    classList.value.forEach((item) => {
      autoCompleteClasses.value.push({
        text: `${item.classTitle} (${item.teacherName})`,
        value: item.docId
      })
    })

    return {
      RULES,
      KUCHIKOMI_TAGS,
      selectedTags,
      isFormValid,
      rating,
      kuchikomiTitle,
      kuchikomi,
      classYear,
      years,
      disabled,
      currentClass,
      classList,
      selectedClassId,
      autoCompleteClasses,
      teacher,
      isOpenSuccessSnackbar,
      isOpenErrorSnackbar,
      resetInput,
      emptyCurrentClass,
      kuchikomiInput,
      createKuchikomi,
      isOpenCreateConfirm,
      isOpenResetConfirm,
      form,
      classCardInfo,
      openCreateConfirm,
      csrfToken,
      storedCsrfToken
    }
  }
})
</script>

<style scoped>
#create {
  margin-top: 3rem;
}
</style>
