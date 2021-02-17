<template>
  <v-container id="about" class="pa-1">
    <v-row no-gutters justify="center" align="center" class="mt-15">
      <v-col cols="12" class="text-center">
        <h1 class="mt-3 font-weight-bold">Learn it. Share it all.</h1>
        <div class="text-subtitle-1 mt-3 px-5">
          「つるコミ」は都留文科大学の授業に関するクチコミを自由に閲覧・作成・共有できるアプリです
        </div>
      </v-col>
      <v-col cols="12" class="my-1">
        <v-img max-height="250" src="/people.webp"></v-img>
      </v-col>
      <v-col cols="8" class="text-center mt-6">
        <h2>機能説明</h2>
      </v-col>
    </v-row>
    <div class="pa-4">
      <!-- 機能説明 -->
      <v-row no-gutters justify="center">
        <v-col cols="12" class="mt-5">
          <div class="text-h6">
            <v-icon color="primary">mdi-magnify</v-icon>検索
          </div>
          <div class="ml-5 mt-2">
            検索ボックスに知りたい授業名を入力し、「クチコミをみる」ボタンを押すとクチコミを閲覧することができます。
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" class="mt-6">
          <div class="text-h6">
            <v-icon color="primary">mdi-pencil-plus-outline</v-icon>作成
          </div>
          <div class="ml-5 mt-2">
            「授業名」の検索ボックスに知りたい授業名を入力し、候補から授業を一つ選択します。
            必要事項を入力して作成ボタンを押せばクチコミの作成が行われます。
          </div>
          <div class="ml-5 mt-2">
            もし「授業名」の検索ボックスに知りたい授業名がない場合は「こちらから新規作成」のリンクから必要事項を入力し、作成ボタンを押せば授業とクチコミの両方が作成されます。
          </div>
        </v-col>
      </v-row>
      <!-- 目的 -->
      <v-row no-gutters justify="center">
        <v-col cols="8" class="text-center mt-6 mb-5">
          <h2>ユーザーの皆様へ</h2>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center" class="mb-5">
        <v-col cols="12" class="mt-5">
          <div>
            ・このアプリは、「COVID-19の影響でリモート授業が中心となった結果、特に新入生にとって授業に関する情報共有が難しくなっている現状を改善したい」という思いから開発しました。
          </div>
          <div class="mt-2">
            ・皆さんの１つのクチコミが同じ都留文科大学生の助けになります。ぜひ積極的な投稿をよろしくお願いいたします🙇‍♂️
          </div>
          <div class="mt-2">
            ・誹謗中傷や荒らし行為といった迷惑行為はお辞めください。運営が迷惑行為と判断した場合、該当する投稿の削除やアカウントの永久的なロックなどを行います。
          </div>
          <div class="mt-2">
            ・もしバグ、改善/追加して欲しい機能、アプリに関する感想などがありましたら
            <a href="https://forms.gle/Q1WtfXe2zKKn9iRDA" target="_blank"
              >こちらのGoogleフォーム</a
            >からお気軽にお知らせください。開発のモチベーションになります🍺
          </div>
          <div class="text-center mt-6">
            <a
              href="https://twitter.com/share?https://tsuruuniv-kuchikomi.web.app/"
              class="twitter-share-button"
              data-text="「つるコミ」〜都留文の授業クチコミ共有アプリ〜"
              data-url="https://tsuruuniv-kuchikomi.web.app/"
              data-related="asatei_umauma"
              data-via="asatei_umauma"
              data-hashtags="つるコミ"
              data-show-count="true"
              data-lang="ja"
              data-size="large"
              >ツイート</a
            >
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            ></script>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'about',
  setup() {}
})
</script>

<style scoped>
h1 {
  font-size: 40px;
}
</style>
