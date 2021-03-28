<template>
  <v-dialog
    v-model="value"
    persistent
    max-width="50rem"
    class="kuchikomi-confirm"
  >
    <v-card rounded>
      <!-- タイトル -->
      <v-toolbar color="primary" class="d-flex justify-center" flat dense short>
        <v-toolbar-title class="white--text">確認</v-toolbar-title>
      </v-toolbar>
      <!-- 中身 -->
      <v-container id="create" fluid class="pa-0 mt-3">
        <v-row no-gutters justify="center">
          <v-col cols="12">
            <v-row no-gutters justify="center">
              <v-col cols="11">
                <div
                  v-if="type === 'createKuchikomi'"
                  class="text-body-1 text-center"
                >
                  以下の内容でクチコミを作成します。<br />
                  よろしいですか？
                </div>
                <div
                  v-else-if="type === 'createClassAndKuchikomi'"
                  class="text-body-1 text-center"
                >
                  以下の内容で授業とクチコミを作成します。<br />
                  よろしいですか？
                </div>
                <div
                  v-else-if="type === 'edit'"
                  class="text-body-1 text-center"
                >
                  以下の内容でクチコミを編集します。<br />
                  よろしいですか？
                </div>
              </v-col>
            </v-row>
            <!-- 授業名＋講師名 -->
            <v-row
              v-if="type !== 'edit'"
              no-gutters
              justify="center"
              class="mt-2"
            >
              <v-col cols="11">
                <TextCaption title="授業情報" />
                <div class="pl-5 text-body-2">
                  <div>{{ input.classTitle }}</div>
                  <div class="text-caption">{{ input.teacherName }}</div>
                </div>
              </v-col>
            </v-row>
            <!-- タグ -->
            <v-row
              v-if="type === 'createClassAndKuchikomi'"
              no-gutters
              justify="center"
              class="mt-2"
            >
              <v-col cols="11">
                <TextCaption title="カテゴリータグ" />
                <div class="pl-5">
                  <v-chip
                    v-for="(tag, idx) in input.tags"
                    :key="idx"
                    :color="tag.color"
                    text-color="white"
                    small
                    class="mr-1"
                  >
                    {{ tag.text }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
            <!-- おすすめ度 -->
            <v-row no-gutters justify="center" class="mt-2">
              <v-col cols="11">
                <!-- 受講した年 -->
                <TextCaption title="受講した年" />
                <div class="pl-5 text-body-2">{{ input.classYear }} 年</div>
                <TextCaption title="おすすめ度(0.5~5)" />
                <div class="d-flex justify-start">
                  <v-rating
                    v-model="input.rating"
                    readonly
                    small
                    half-increments
                    color="star"
                    background-color="grey lighten-1"
                  />
                  <div class="my-2">({{ input.rating }})</div>
                </div>
              </v-col>
            </v-row>
            <!-- タイトル -->
            <v-row no-gutters justify="center">
              <v-col cols="11">
                <TextCaption title="クチコミのタイトル" />
                <v-text-field
                  v-model="input.kuchikomiTitle"
                  flat
                  solo
                  dense
                  outlined
                  readonly
                  no-resize
                  color="primary"
                />
              </v-col>
            </v-row>
            <!-- クチコミ -->
            <v-row no-gutters justify="center">
              <v-col cols="11">
                <TextCaption title="クチコミの内容" />
                <v-textarea
                  v-model="input.kuchikomi"
                  flat
                  solo
                  dense
                  outlined
                  readonly
                  no-resize
                  height="120"
                  color="primary"
                />
              </v-col>
            </v-row>

            <!-- 送信・キャンセルボタン -->
            <div class="d-flex justify-center pb-5">
              <AppBtn
                color="grey darken-2"
                class="mr-1"
                :disabled="disabled"
                @click="$emit('input', false)"
              >
                いいえ
              </AppBtn>
              <AppBtn
                color="primary"
                class="mr-3"
                depressed
                :disabled="disabled"
                @click="ok"
              >
                はい
              </AppBtn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'KuchikomiConfirm',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    input: {
      type: Object,
      required: true
    },
    type: {
      type: String
    }
  },
  setup(_, { emit }) {
    const disabled = ref(false)
    const ok = () => {
      disabled.value = true
      emit('ok')
    }
    return { disabled, ok }
  }
})
</script>
