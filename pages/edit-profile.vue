<template>
  <v-container id="profile">
    <v-form ref="form" v-model="isFormValid">
      <v-row no-gutters justify="center">
        <v-col cols="11" class="mt-12">
          <div class="text-h6 d-flex justify-center my-3 font-weight-bold">
            プロフィール設定
          </div>
          <!-- ユーザーネーム -->
          <section>
            <TextCaption required title="ユーザーネーム" class="mb-1" />
            <TextInput
              v-model="user.username"
              :rules="RULES.required"
              color="primary"
            />
          </section>

          <!-- TODO: 画像 -->
          <!-- <TextCaption title="プロフィール画像" class="mb-1" />
          <v-file-input
            v-model="imageFile"
            outlined
            clearable
            show-size
            hint="画像サイズは1MBまで"
            persistent-hint
            accept=".png, .jpeg"
            label="画像を選択"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
            @change="makePhotoURL"
          />
          <div class="d-flex justify-center">
            <v-img
              class="image"
              :src="photoURL || originalPhotoURL"
              max-height="100"
              max-width="100"
            />
          </div>
          <div class="text-center text-caption">プレビュー</div> -->

          <!-- 送信・キャンセルボタン -->
          <div class="d-flex justify-center py-3 mt-5">
            <AppBtn
              color="primary"
              depressed
              :disabled="!isFormValid || disabled"
              @click="isOpenUpdateConfirm = true"
            >
              保存
            </AppBtn>
          </div>
        </v-col>

        <!-- ダイアログ・スナックバー -->
        <ConfirmDialog
          v-model="isOpenUpdateConfirm"
          text="編集"
          @ok="updateProfile"
        />
        <SnackBar
          v-model="isOpenSuccessSnackbar"
          text="【成功】プロフィールの編集を完了しました🐱"
          color="success"
        />
        <SnackBar
          v-model="isOpenFileSizeErrorSnackbar"
          text="【エラー】画像の容量が大きすぎます。"
          color="error"
        />
        <SnackBar
          v-model="isOpenErrorSnackbar"
          text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢"
          color="error"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { User } from '@/types/State'
import { suid } from 'rand-token'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です']
} as const

export default defineComponent({
  name: 'profile',
  setup(_, { root }) {
    const isFormValid = ref(true)
    const user = computed(() => {
      // console.debug('user ', user.value)
      return Object.assign({}, root.$store.getters.user)
    })

    const isOpenUpdateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const isOpenFileSizeErrorSnackbar = ref(false)

    const imageFile = ref<File>()
    const photoURL = ref<ArrayBuffer | string>()
    const originalPhotoURL = Object.assign({}, user.value.photoURL)

    // 変更したプロフィールを全ての口コミに反映
    const disabled = ref(false)
    const makePhotoURL = (file: File): void => {
      if (file) {
        if (file.size > 1048480) {
          isOpenFileSizeErrorSnackbar.value = true
          disabled.value = true
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          if (fr.result) photoURL.value = fr.result
        })
      }
    }
    const updateProfile = async (): Promise<void> => {
      if (csrfToken !== storedCsrfToken) {
        isOpenErrorSnackbar.value = true
        return
      }
      isOpenErrorSnackbar.value = false
      isOpenSuccessSnackbar.value = false
      //  更新処理
      const updatedUser: User = {
        uid: user.value.uid,
        username: user.value.username,
        photoURL:
          photoURL.value ||
          user.value.photoURL ||
          'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'
      }
      console.debug('user', updatedUser)
      try {
        const docRef = db.collection('users').doc(user.value.uid)
        await docRef.set(updatedUser, { merge: true })
        isOpenUpdateConfirm.value = false
        isOpenSuccessSnackbar.value = true
        root.$store.dispatch('setUser', updatedUser)
      } catch (e) {
        console.error('update に失敗！', e)
        isOpenUpdateConfirm.value = false
        isOpenErrorSnackbar.value = true
      }
    }
    /**
     * init
     */
    const csrfToken = suid(16)
    root.$store.dispatch('setCsrfToken', csrfToken)
    const storedCsrfToken = root.$store.getters.csrfToken

    return {
      RULES,
      user,
      imageFile,
      originalPhotoURL,
      photoURL,
      updateProfile,
      isFormValid,
      isOpenUpdateConfirm,
      isOpenSuccessSnackbar,
      isOpenErrorSnackbar,
      isOpenFileSizeErrorSnackbar,
      makePhotoURL,
      disabled,
      csrfToken,
      storedCsrfToken
    }
  }
})
</script>
<style scoped>
.image {
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
</style>
