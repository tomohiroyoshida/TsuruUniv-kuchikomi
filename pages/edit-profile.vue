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

          <!-- 画像 -->
          <TextCaption title="プロフィール画像" class="mb-1" />
          <v-file-input
            v-model="imageFile"
            outlined
            clearable
            accept=".png, .jpeg"
            label="画像を選択"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
            @change="makePhotoURL"
          />
          <div class="d-flex justify-center">
            <v-img
              :src="photoURL || originalPhotoURL"
              max-height="100"
              max-width="100"
            />
          </div>
          <div class="text-center text-caption">プレビュー</div>

          <!-- 送信・キャンセルボタン -->
          <div class="d-flex justify-center py-3 mt-5">
            <AppBtn
              color="primary"
              depressed
              :disabled="!isFormValid"
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
          v-model="isOpenErrorSnackbar"
          text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢"
          color="error"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'
import { User } from '@/types/State'

const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です']
} as const

export default defineComponent({
  name: 'profile',
  setup(_, { root }) {
    const isFormValid = ref(true)
    const user: User = Object.assign({}, root.$store.getters.user)

    const isOpenUpdateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)

    const imageFile = ref<File>()
    const photoURL = ref<ArrayBuffer | string>()
    const originalPhotoURL = Object.assign({}, user.photoURL)

    // 変更したプロフィールを全ての口コミに反映

    const makePhotoURL = (file: File): void => {
      if (file) {
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          if (fr.result) photoURL.value = fr.result
        })
      }
    }
    const updateProfile = async (): Promise<void> => {
      isOpenErrorSnackbar.value = false
      isOpenSuccessSnackbar.value = false
      //  更新処理
      const updatedUser: User = {
        uid: user.uid,
        username: user.username,
        photoURL:
          photoURL.value ||
          'https://storage.googleapis.com/studio-cms-assets/projects/RQqJDxPBWg/s-1000x1000_v-fs_webp_eb270a46-5d4c-484e-ada2-a42a7f45f182.webp'
      }
      try {
        const docRef = db.collection('users').doc(user.uid)
        await docRef.set(updatedUser, { merge: true })
        isOpenUpdateConfirm.value = false
        isOpenSuccessSnackbar.value = true
        root.$store.dispatch('setUser', updatedUser)
      } catch (e) {
        console.error(e)
        isOpenUpdateConfirm.value = false
        isOpenErrorSnackbar.value = true
      }
    }

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
      makePhotoURL
    }
  }
})
</script>
