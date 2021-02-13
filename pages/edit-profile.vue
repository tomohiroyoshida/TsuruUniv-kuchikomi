<template>
  <v-container id="profile">
    <v-form ref="form" v-model="isFormValid">
      <v-row no-gutters justify="center">
        <v-col cols="11" class="mt-12">
          <div class="text-h6 d-flex justify-center my-3 font-weight-bold">
            プロフィール編集
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
          <v-row no-gutters justify="center">
            <v-col cols="6">
              <section>
                <TextCaption title="学部" class="mb-1" />
                <SelectInput
                  v-model="user.faculty"
                  :items="FACULTIES"
                  color="primary"
                  class="pr-1"
                />
              </section>
            </v-col>
            <v-col cols="6">
              <section>
                <TextCaption title="学科" class="mb-1" />
                <SelectInput
                  v-model="user.department"
                  :items="DEPARTMENTS"
                  color="primary"
                />
              </section>
            </v-col>
          </v-row>
          <!-- TODO: 画像 -->
          <!-- <TextCaption title="プロフィール画像" class="mb-1" />
          <v-file-input
            v-model="imageFile"
            outlined
            clearable
            accept=".png, .jpeg"
            label="画像を選択"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
            @change="makephotoURL"
          />

          <div class="d-flex justify-center">
            <v-img
              :src="photoURL ? photoURL : originalPhotoURL"
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
              :disabled="!isFormValid"
              @click="isOpenUpdateConfirm = true"
            >
              保存
            </AppBtn>
          </div>
        </v-col>
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

const FACULTIES = [
  { text: '文学部', value: 'letters' },
  { text: '教養学部 ', value: 'liberalArts' },
  { text: '大学院', value: 'graduate' }
]
const DEPARTMENTS = [
  { text: '国文学科', value: 'japanese' },
  { text: '英文学科', value: 'english' },
  { text: '比較文化学科', value: 'comparativeCulture' },
  { text: '国際教育学科', value: 'globalEducation' },
  { text: '学校教育学科', value: 'teacherEducation' },
  { text: '地域社会学科', value: 'communitySociety' }
]
const RULES = {
  required: [(v: string) => !!v || 'この欄の入力は必須です']
}

export default defineComponent({
  name: 'profile',
  setup(_, { root }) {
    const isFormValid = ref(true)
    const user: User = Object.assign({}, root.$store.getters.user)

    const isOpenUpdateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)

    const imageFile = ref<File>()
    const originalPhotoURL = ref()
    originalPhotoURL.value = root.$store.getters.user.photoURL
    const photoURL = ref<ArrayBuffer | string>()
    const makephotoURL = (file: File) => {
      if (file) {
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          if (fr.result) photoURL.value = fr.result
          console.debug('url', photoURL.value)
        })
      }
    }
    const updateProfile = async () => {
      isOpenErrorSnackbar.value = false
      isOpenSuccessSnackbar.value = false
      //  更新処理
      // if (photoURL.value) {
      const updatedUser: User = {
        uid: user.uid,
        username: user.username,
        department: user.department,
        faculty: user.faculty,
        photoURL: root.$store.getters.user.photoURL
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
      // } else {
      //   isOpenUpdateConfirm.value = false
      //   isOpenErrorSnackbar.value = true
      // }
    }
    return {
      FACULTIES,
      DEPARTMENTS,
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
      makephotoURL
    }
  }
})
</script>
