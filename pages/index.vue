<template>
  <v-container id="about" class="pa-1">
    <v-row no-gutters justify="center" align="center" class="mt-15">
      <v-col cols="12" class="text-center">
        <h1 class="mt-3 font-weight-bold">Learn it. Share it all.</h1>
        <div class="text-subtitle-1 mt-3 px-5">
          「つるコミ」は都留文の授業に関するクチコミ共有コミュニティです。
        </div>
      </v-col>
      <v-col cols="12" class="my-1">
        <v-img max-height="250" src="/people.webp" alt="色々な人々"></v-img>
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
            ユーザーによって投稿されたクチコミを閲覧することができます。
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters justify="center">
        <v-col cols="12" class="mt-6">
          <div class="text-h6">
            <v-icon color="primary">mdi-pencil-plus-outline</v-icon>作成
          </div>
          <div class="ml-5 mt-2">
            「クチコミ」のみと、「授業＋クチコミ」の作成ができます。
          </div>
          <div class="ml-5 mt-2">
            自分が作成したクチコミはいつでも編集・削除できます(
            <v-icon color="info">mdi-pencil-outline</v-icon>で編集
            <v-icon color="error">mdi-trash-can-outline</v-icon>で削除)。
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
            ・このアプリは、「都留文の授業の情報をよりオープンに」というコンセプトから開発しました。<br />
            ・履修登録する時に「先生や授業の評判に関する学生の生の声を知りたい…でも聞ける人がいない…」という悩みを解決します。
          </div>
          <div class="mt-2">
            ・もしこのアプリが便利だなと思っていただけたら、次はご自身のクチコミを投稿してみましょう！皆さんの１つのクチコミが同じ都留文科大学生の助けになります。
          </div>
          <div class="mt-2">
            ・クチコミを作成する際は、その言葉を受け取る人がいることを想像し、丁寧な言葉遣いを心がけましょう。<br />
            ・<a
              href="https://www.notion.so/Q-A-a1f01d9ab2144b248ced87e036285dad"
              target="_blank"
            >
              迷惑行為</a
            >はお控えください。運営が迷惑行為と判断した場合、該当する投稿の削除やアカウントのブロックなどを行います。
          </div>
          <div class="mt-2">
            ・バグ、改善/追加して欲しい機能、アプリに関するご感想などがありましたらこちらの
            <a href="https://forms.gle/Q1WtfXe2zKKn9iRDA" target="_blank"
              >Googleフォーム</a
            >または<a href="https://twitter.com/asatei_umauma" target="_blank"
              >Twitter</a
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
              >Twitterでシェア</a
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

<script lang="ts" async>
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'Home'
})
</script>

<style scoped>
h1 {
  font-size: 40px;
}
</style>
