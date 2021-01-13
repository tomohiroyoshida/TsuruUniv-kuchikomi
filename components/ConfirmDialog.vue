<template>
  <div class="confirm-dialog">
    <v-dialog :value="value" persistent width="30rem">
      <v-card rounded>
        <v-toolbar color="primary" flat dense>
          <v-toolbar-title class="white--text">確認</v-toolbar-title>
          <v-spacer />
          <v-btn text fab small @click="$emit('input', false)">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row no-gutters>
          <v-col cols="12">
            <!-- テキスト -->
            <v-card-text class="d-flex justify-center">
              <div v-if="text === '作成'">
                <div>入力した内容で授業とクチコミを新規作成します。</div>
                <div>よろしいですか？</div>
              </div>
              <div v-else>
                <div>入力した内容をリセットします。</div>
                <div>よろしいですか？</div>
              </div>
            </v-card-text>
          </v-col>
          <!-- ボタン -->
          <v-col cols="12" class="d-flex justify-center py-3">
            <AppBtn
              outlined
              color="grey darken-2"
              class="mx-1"
              @click="$emit('input', false)"
            >
              いいえ
            </AppBtn>
            <AppBtn depressed color="primary" class="mr-1" @click="$emit('ok')">
              はい
            </AppBtn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
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
