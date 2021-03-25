<template>
  <v-dialog
    v-model="value"
    persistent
    width="30rem"
    class="confirm-dialog"
    v-bind="$attrs"
  >
    <v-card rounded>
      <!-- タイトル -->
      <v-toolbar color="primary" class="d-flex justify-center" flat dense>
        <v-toolbar-title class="white--text">確認</v-toolbar-title>
      </v-toolbar>
      <!-- 中身 -->
      <v-row no-gutters>
        <v-col cols="12">
          <!-- テキスト -->
          <v-card-text class="text-center">
            <div v-if="text == 'reset'">
              <div>入力した内容を全て削除します。</div>
            </div>
            <div v-else-if="text === 'delete'">
              <div>
                クチコミを<span class="red--text font-weight-bold">削除</span
                >します。
              </div>
              <div>この操作は取り消せません。</div>
            </div>
            <div v-else-if="text == 'update-profile'">
              <div>入力した内容でプロフィールを設定します。</div>
            </div>
            <div>よろしいですか？</div>
          </v-card-text>
        </v-col>

        <v-col cols="12">
          <v-divider />
        </v-col>
        <!-- ボタン -->
        <v-col cols="12" class="d-flex justify-center py-3">
          <AppBtn
            color="grey darken-2"
            class="mx-1"
            :disabled="disabled"
            @click.stop="$emit('input', false)"
          >
            いいえ
          </AppBtn>
          <AppBtn
            depressed
            class="mr-2"
            :color="text === 'delete' ? 'red' : 'primary'"
            :disabled="disabled"
            @click.stop="ok"
          >
            はい
          </AppBtn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    text: {
      type: String
    }
  },
  setup(_, { emit }) {
    const disabled = ref(false)
    const ok = () => {
      disabled.value = true
      emit('ok')
    }
    return { ok, disabled }
  }
})
</script>
