<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card height="1000px" color="red">
          <v-card-title>hoge</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import db from '@/plugins/firebase'

export default defineComponent({
  name: 'home',
  setup() {
    return {}
  }
})
</script>
