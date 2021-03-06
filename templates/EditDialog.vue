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
                      color="warning"
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
          <ConfirmDialog
            v-model="isOpenUpdateConfirm"
            text="編集"
            @ok="update"
          />
          <ConfirmDialog
            v-model="isOpenResetConfirm"
            text="クリア"
            @ok="resetInput"
          />

          <!-- スナックバー -->
          <SnackBar
            v-model="isOpenSuccessSnackbar"
            text="【成功】クチコミを編集しました✨"
            color="success"
          />
          <SnackBar
            v-model="isOpenErrorSnackbar"
            text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢"
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
    // 編集前のクチコミのデータ
    // eslint-disable-next-line prefer-const
    let originalKuchikomi = Object.assign({}, props.updatingKuchikomi)
    const isFormChanged = computed(() => {
      return originalKuchikomi !== props.updatingKuchikomi
    })

    const openCreateConfirm = (): void => {
      isOpenUpdateConfirm.value = true
      isOpenSuccessSnackbar.value = false
      isOpenErrorSnackbar.value = false
    }

    // 更新
    const update = async (): Promise<void> => {
      disabled.value = true
      const docRef = db
        .collection('classes')
        .doc(root.$route.params.id)
        .collection('kuchikomis')
        .doc(props.updatingKuchikomi.docId)
      try {
        const data: Kuchikomi = {
          docId: props.updatingKuchikomi.docId,
          kuchikomiTitle: props.updatingKuchikomi.kuchikomiTitle,
          rating: props.updatingKuchikomi.rating,
          classYear: props.updatingKuchikomi.classYear,
          kuchikomi: props.updatingKuchikomi.kuchikomi,
          uid: root.$store.getters.user.uid,
          username: root.$store.getters.user.username,
          createdAt: props.updatingKuchikomi.createdAt
        }
        await docRef.set(data, { merge: true })
        isOpenUpdateConfirm.value = false
        isOpenSuccessSnackbar.value = true
        setTimeout(() => {
          disabled.value = false
          emit('updated', data)
        }, 1500)
      } catch (e) {
        console.error('update', e)
        isOpenErrorSnackbar.value = true
      }
    }

    const isOpenResetConfirm = ref(false)
    // 記入内容を全てリセット
    const form = ref(null)
    const resetInput = (): void => {
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
