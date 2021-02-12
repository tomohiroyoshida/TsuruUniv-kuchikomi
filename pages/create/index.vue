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
                v-model="selectedClass"
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

          <!--  TODO: 授業の情報の書かれたカード -->
          <!-- <v-row v-if="selectedClass" no-gutters justify="center">
            <v-col cols="10">
              <div class="required-caption text-caption my-1 ml-3">
                授業の情報
              </div>
              <v-card rounded outlined>
                <v-card-title>{{ selectedClass }}</v-card-title>
                <v-card-subtitle>
                  講師: {{ classCardInfo.teacher }}
                </v-card-subtitle>
                <v-card-text>
                  {{ classCardInfo.dayOfWeek }}曜 {{ classCardInfo.period }}限
                </v-card-text>
              </v-card>
            </v-col>
          </v-row> -->

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
        @ok="createKuchikomi"
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
        v-model="isOpenErrorSnackbar"
        text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢"
        color="error"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'
import db from '@/plugins/firebase'
import { Kuchikomi } from 'types/State'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です'],
  kuchikomi: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) =>
      (v && v.length <= 1000) || 'クチコミ内容は1000文字以下で記入してください'
  ],
  requiredWith20: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) => (v && v.length <= 20) || '20文字以下で記入してください'
  ]
}

export default defineComponent({
  name: 'create',
  setup(_, { root }) {
    const selectedClass = ref('')
    const teacher = ref('')
    const isFormValid = ref(true)
    const rating = ref(0.5)
    const kuchikomiTitle = ref('')
    const kuchikomi = ref('')
    const year = ref('')
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように

    // TODO: カード
    // const hasCardInfo = ref(false)
    // let classCardInfo = reactive<Class>({
    //   docId: '',
    //   title: '',
    //   teacher: '',
    //   dayOfWeek: '',
    //   period: '',
    //   term: '',
    //   createdAt: ''
    // })
    // const showCard = async (title: String) => {
    //   await classList.value.filter((item) => {
    //     if (item.title === title) {
    //       classCardInfo = item
    //       hasCardInfo.value = true
    //     } else {
    //       hasCardInfo.value = false
    //     }
    //   })
    // }

    // 作成
    // const disabledSubmit = ref(true) 必要？
    // 選択された授業のidを格納
    const targetClassId = ref('')
    watch(selectedClass, (id: string): void => {
      targetClassId.value = id
    })

    const isOpenCreateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)

    const openCreateConfirm = () => {
      isOpenCreateConfirm.value = true
      isOpenSuccessSnackbar.value = false
      isOpenErrorSnackbar.value = false
    }
    const createKuchikomi = async (): Promise<void> => {
      // disabledSubmit.value = false
      isOpenCreateConfirm.value = false
      //  Firestoreにクチコミの情報追加
      const docRef = db
        .collection('classes')
        .doc(targetClassId.value)
        .collection('kuchikomis')
        .doc()
      try {
        const data: Kuchikomi = {
          docId: docRef.id,
          kuchikomiTitle: kuchikomiTitle.value,
          kuchikomi: kuchikomi.value,
          rating: rating.value,
          classYear: year.value,
          uid: root.$store.getters.user.uid,
          username: root.$store.getters.user.username,
          createdAt: new Date().toLocaleString()
        }
        await docRef.set(data)
        resetInput()
        isOpenSuccessSnackbar.value = true
      } catch (e) {
        console.error(e)
        isOpenErrorSnackbar.value = true
      }
    }

    // キャンセル
    const isOpenResetConfirm = ref(false)

    // 記入内容を全てリセット
    const form = ref(null)
    const resetInput = (): void => {
      isOpenResetConfirm.value = false
      selectedClass.value = ''
      year.value = ''
      rating.value = 0.5
      kuchikomiTitle.value = ''
      kuchikomi.value = ''
      // @ts-ignore "Object is possibly null" エラーをignore
      form.value.resetValidation()
    }

    /**
     * init
     */
    // 授業のリスト
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
        text: item.classTitle,
        value: item.docId
      })
    })

    return {
      RULES,
      isFormValid,
      rating,
      kuchikomiTitle,
      kuchikomi,
      year,
      years,
      classList,
      selectedClass,
      autoCompleteClasses,
      teacher,
      isOpenSuccessSnackbar,
      isOpenErrorSnackbar,
      resetInput,
      createKuchikomi,
      isOpenCreateConfirm,
      isOpenResetConfirm,
      form,
      // showCard,
      // hasCardInfo,
      // classCardInfo,
      targetClassId,
      openCreateConfirm
    }
  }
})
</script>

<style scoped>
#create {
  margin-top: 3rem;
}
</style>
