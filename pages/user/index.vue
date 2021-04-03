<template>
  <v-container id="profile">
    <v-form ref="form" v-model="isFormValid">
      <v-row no-gutters justify="center">
        <v-col cols="11" class="mt-12">
          <div class="text-h6 d-flex justify-center my-3 font-weight-bold">
            プロフィール設定
          </div>
          <!-- 名前 -->
          <div>
            <TextCaption required title="名前" class="mb-1" />
            <TextInput
              v-model="user.username"
              :rules="RULES.required"
              :counter="30"
            />
          </div>
          <!-- 学科 -->
          <div>
            <TextCaption title="学科" class="mb-1" />
            <SelectInput v-model="user.department" :items="DEPARTMETS" />
          </div>
          <!-- Twitter -->
          <div>
            <TextCaption title="Twitter ID" class="mb-1" />
            <TextInput
              v-model="twitterId"
              placeholder="例: asatei_umauma"
              prefix="@"
            />
          </div>
          <!-- 画像 -->
          <TextCaption title="プロフィール画像" class="mb-1" />
          <v-file-input
            v-model="imageFile"
            dense
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
          <div class="text-center text-caption pt-2">プレビュー</div>

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
          text="update-profile"
          @ok="updateProfile"
        />
        <SnackBar
          v-model="isOpenSuccessSnackbar"
          text="【成功】プロフィールを設定しました！検索画面へ移動します💨"
          color="success"
        />
        <SnackBar
          v-model="isOpenFileSizeErrorSnackbar"
          text="【エラー】画像サイズが1MB以上です😨(カメラで撮影した写真はサイズが大きすぎる場合があります)"
          color="error"
        />
        <SnackBar
          v-model="isOpenErrorSnackbar"
          text="【エラー】エラーが起きました。画面をリロードしてもう一度試してください😢 直らない場合は運営に連絡してください🙇‍♂️"
          color="error"
        />
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts" async>
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { User } from '@/types/State'
import { suid } from 'rand-token'

const RULES = {
  required: [
    (v: string) => !!v || 'この欄の入力は必須です',
    (v: string) =>
      (!!v && v.length < 31) || '名前は30文字以下で入力してください。'
  ]
} as const

const DEPARTMETS = [
  { text: '国文', value: 'japanese' },
  { text: '英文', value: 'english' },
  { text: '比較文化', value: 'comparativeCulture' },
  { text: '国際教育', value: 'globalEducation' },
  { text: '学校教育', value: 'teacherEducation' },
  { text: '地域社会', value: 'communitySociety' }
] as const

export default defineComponent({
  name: 'UpdateProfile',
  setup(_, { root }) {
    const isFormValid = ref(true)
    const user = computed<User>(() => {
      return Object.assign({}, root.$store.getters.user as User)
    })
    // TwitterのユーザーIDの部分のみを表示
    const twitterId = ref('')
    twitterId.value = (function () {
      const index = user.value.twitterURL.indexOf('m')
      const userId = user.value.twitterURL.slice(index + 2)
      return userId
    })()

    const isOpenUpdateConfirm = ref(false)
    const isOpenSuccessSnackbar = ref(false)
    const isOpenErrorSnackbar = ref(false)
    const isOpenFileSizeErrorSnackbar = ref(false)

    const imageFile = ref<File>()
    const photoURL = ref<string>('')
    const originalPhotoURL = user.value.photoURL

    // 画像変更
    const disabled = ref(false)
    const makePhotoURL = (file: File): void => {
      disabled.value = false
      isOpenFileSizeErrorSnackbar.value = false
      if (file) {
        // ファイルサイズが1MB以上はエラー
        if (file.size > 1048480) {
          isOpenFileSizeErrorSnackbar.value = true
          disabled.value = true
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          if (fr.result && typeof fr.result === 'string')
            photoURL.value = fr.result
        })
      }
    }
    // プロフィール更新
    const updateProfile = async (): Promise<void> => {
      disabled.value = true
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
        department: user.value.department,
        photoURL: photoURL.value || user.value.photoURL || '',
        twitterURL: twitterId.value
          ? `https://twitter.com/${twitterId.value}`
          : ''
      }
      // user更新
      try {
        const docRef = db.collection('users').doc(user.value.uid)
        await docRef.update(updatedUser)
        isOpenUpdateConfirm.value = false
        isOpenSuccessSnackbar.value = true
        root.$store.dispatch('setUser', updatedUser)
        setTimeout(() => {
          root.$router.push('/search')
        }, 1500)
      } catch (e) {
        console.error('update', e)
        isOpenUpdateConfirm.value = false
        isOpenErrorSnackbar.value = true
      }
    }
    /**
     * init
     */
    // CSRF Token
    const csrfToken = suid(16)
    root.$store.dispatch('setCsrfToken', csrfToken)
    const storedCsrfToken = root.$store.getters.csrfToken

    return {
      RULES,
      DEPARTMETS,
      user,
      twitterId,
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
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
</style>
