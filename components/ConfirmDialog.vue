<template>
  <v-dialog :value="value" persistent width="30rem" class="confirm-dialog">
    <v-card rounded>
      <!-- タイトル -->
      <v-toolbar color="primary" class="d-flex justify-center" flat dense>
        <v-toolbar-title class="white--text">確認</v-toolbar-title>
      </v-toolbar>
      <!-- 中身 -->
      <v-row no-gutters>
        <v-col cols="12">
          <!-- テキスト -->
          <v-card-text class="d-flex justify-center">
            <div v-if="text === '作成'">
              <div>
                入力した内容で授業とクチコミを新規作成します。よろしいですか？
              </div>
            </div>
            <div v-else-if="text == 'クリア'">
              <div>入力した内容を全て削除します。</div>
              <div>よろしいですか？</div>
            </div>
            <div v-else-if="text == '編集'">
              <div>入力した内容で編集します。</div>
              <div>よろしいですか？</div>
            </div>
            <div v-else-if="text === '削除'">
              <div>
                このクチコミを削除します。この操作は<span class="red--text"
                  >取り消せません。</span
                >
              </div>
              <div>よろしいですか？</div>
            </div>
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
            @click.stop="$emit('input', false)"
          >
            いいえ
          </AppBtn>
          <AppBtn color="primary" class="mr-1" @click.stop="$emit('ok')">
            はい
          </AppBtn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  setup() {}
})
</script>

<style scoped></style>
