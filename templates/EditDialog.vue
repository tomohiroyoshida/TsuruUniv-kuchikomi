<template>
  <v-dialog v-model="value" persistent fullscreen class="edit-dialog">
    <v-card flat>
      <v-toolbar color="primary" flat dense>
        <v-spacer />
        <v-toolbar-title class="white--text">クチコミを編集</v-toolbar-title>
        <v-spacer />
        <v-btn text fab small :disabled="disabled" @click="$emit('cancel')">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- 内容 -->
      <v-container id="create" fluid class="pa-0 mt-3">
        <v-row no-gutters justify="center">
          <v-col cols="12">
            <v-form ref="form" v-model="isFormValid">
              <!-- 受講した年 -->
              <v-row no-gutters justify="center">
                <v-col cols="10">
                  <TextCaption required title="受講した年" />
                  <SelectInput
                    v-model="updatingKuchikomi.classYear"
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
                      v-model="updatingKuchikomi.rating"
                      half-increments
                      color="star"
                      background-color="grey lighten-1"
                    />
                    <div class="ml-5 my-2">
                      ({{ updatingKuchikomi.rating }})
                    </div>
                  </div>
                </v-col>
              </v-row>
              <!-- タイトル -->
              <v-row no-gutters justify="center">
                <v-col cols="10">
                  <TextCaption required title="クチコミのタイトル" />
                  <TextInput
                    v-model="updatingKuchikomi.kuchikomiTitle"
                    :rules="RULES.requiredWith30"
                    :counter="30"
                    placeholder="例： おすすめの授業です"
                  />
                </v-col>
              </v-row>
              <!-- クチコミ -->
              <v-row no-gutters justify="center">
                <v-col cols="10">
                  <TextCaption required title="クチコミの内容" />
                  <TextareaInput
                    v-model="updatingKuchikomi.kuchikomi"
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
                :disabled="disabled"
                @click="isOpenResetConfirm = true"
              >
                クリア
              </AppBtn>
              <AppBtn
                color="primary"
                depressed
                :disabled="!isFormValid || !isFormChanged || disabled"
                @click="openCreateConfirm"
              >
                編集
              </AppBtn>
            </div>
          </v-col>

          <!-- 確認ダイアログ -->
          <KuchikomiConfirm
            v-model="isOpenUpdateConfirm"
            :input="updatingKuchikomi"
            type="edit"
            @ok="update"
          />
          <ConfirmDialog
            v-model="isOpenResetConfirm"
            text="reset"
            @ok="resetInput"
          />

          <!-- スナックバー -->
          <SnackBar
            v-model="isOpenSuccessSnackbar"
            text="【成功】クチコミを編集しました✍️"
            color="success"
          />
          <SnackBar
            v-model="isOpenErrorSnackbar"
            text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢 直らない場合は運営に連絡してください🙇‍♂️"
            color="error"
          />
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref
} from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { CollKuchikomi, Kuchikomi, Class, User } from 'types/State'
import { setAvgRating } from '@/helpers/setAvgRating'

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
}
export default defineComponent({
  name: 'EditDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    updatingKuchikomi: {
      type: Object as PropType<Kuchikomi>,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const years = ref(['2016', '2017', '2018', '2019', '2020', '2021', '不明']) // TODO: daysjsとか使って最新の年月~10年前？まで選択できるように
    const isFormValid = ref(true)
    const disabled = ref(false)
    const isOpenUpdateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    // 編集前のクチコミの内容
    const originalKuchikomi = Object.assign({}, props.updatingKuchikomi)
    // 内容が変わったかどうかのフラグ
    const isFormChanged = computed(() => {
      return originalKuchikomi !== props.updatingKuchikomi
    })

    const openCreateConfirm = () => {
      isOpenUpdateConfirm.value = true
      isOpenSuccessSnackbar.value = false
      isOpenErrorSnackbar.value = false
    }

    // 更新処理
    // TODO:kuchikomis collection に統合
    const update = async () => {
      disabled.value = true
      try {
        const classId = root.$route.params.id
        await setAvgRating(classId) // 授業のおすすめ度の平均値を更新
        const targetClass: Class = await db
          .collection('classes')
          .doc(classId)
          .get()
          .then((doc) => doc.data() as Class)

        const storeUser = ref<User>(root.$store.getters.user)
        // 更新した内容
        const collKuchikomi: CollKuchikomi = {
          docId: props.updatingKuchikomi.docId,
          rating: props.updatingKuchikomi.rating,
          classYear: props.updatingKuchikomi.classYear,
          kuchikomiTitle: props.updatingKuchikomi.kuchikomiTitle,
          kuchikomi: props.updatingKuchikomi.kuchikomi,
          uid: storeUser.value.uid,
          username: storeUser.value.username,
          classId,
          classTitle: targetClass.classTitle,
          classTeacherName: targetClass.teacherName,
          createdAt: props.updatingKuchikomi.createdAt
        }
        // kuchikomis colection を更新
        await db
          .collection('kuchikomis')
          .doc(collKuchikomi.docId)
          .set(collKuchikomi)

        isOpenUpdateConfirm.value = false
        isOpenSuccessSnackbar.value = true
        setTimeout(() => {
          emit('updated', collKuchikomi)
          disabled.value = false
        }, 1200)
      } catch (e) {
        console.error('update', e)
        isOpenErrorSnackbar.value = true
      }
    }

    // 記入内容をリセット
    const isOpenResetConfirm = ref(false)
    const form = ref(null)
    const resetInput = () => {
      isOpenResetConfirm.value = false
      props.updatingKuchikomi.classYear = ''
      props.updatingKuchikomi.rating = 0.5
      props.updatingKuchikomi.kuchikomiTitle = ''
      props.updatingKuchikomi.kuchikomi = ''
      // @ts-ignore "Object is possibly null" エラーをignore
      form.value.resetValidation()
    }

    return {
      RULES,
      isFormValid,
      years,
      isOpenSuccessSnackbar,
      isOpenErrorSnackbar,
      resetInput,
      update,
      isOpenUpdateConfirm,
      isOpenResetConfirm,
      form,
      disabled,
      openCreateConfirm,
      originalKuchikomi,
      isFormChanged
    }
  }
})
</script>

<style scoped>
.toolbar {
  position: relative;
}
.btn {
  position: absolute;
  top: 10px;
  right: 0px;
}
</style>
