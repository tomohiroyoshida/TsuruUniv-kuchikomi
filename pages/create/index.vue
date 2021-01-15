<template>
  <v-container id="create" fluid class="pa-1">
    <v-row no-gutters justify="center">
      <v-col cols="12">
        <div class="text-h6 d-flex justify-center my-3">クチコミを作成</div>
        <v-form ref="form" v-model="isFormValid">
          <v-row no-gutters justify="center">
            <!-- 授業名 -->
            <v-col cols="10" class="px-1">
              <RequiredCaption class="my-1">
                授業名 (見つからない場合は
                <nuxt-link to="/create/new-class">こちらから新規作成</nuxt-link
                >)
              </RequiredCaption>
              <v-autocomplete
                v-model="title"
                :items="classTitles"
                :rules="RULES.title"
                flat
                solo
                dense
                outlined
                clearable
                cache-items
                hide-no-data
                item-color="primary"
                color="primary"
                label="「全角」で入力"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { Class } from '@/types/State'

const RULES = {
  title: [(v: string) => !!v || '授業名は必須です'],
  teacher: [(v: string) => !!v || '講師名は必須です']
}

export default defineComponent({
  name: 'create',
  setup(_, { root }) {
    const title = ref('')
    const teacher = ref('')
    const isFormValid = ref(true)
    /**
     * init
     */
    const classTitles = ref<String[]>([])
    const fetchedClasses = ref<Class[]>([])
    fetchedClasses.value = root.$store.getters.classes
    console.debug('fetchedClasses: ', fetchedClasses.value)

    // 授業のタイトルの配列を作成
    fetchedClasses.value.forEach((item) => {
      classTitles.value.push(item.title)
    })
    console.debug('titles:', classTitles.value)

    return { RULES, isFormValid, fetchedClasses, title, classTitles, teacher }
  }
})
</script>

<style scoped>
#create {
  margin-top: 3rem;
}
</style>
