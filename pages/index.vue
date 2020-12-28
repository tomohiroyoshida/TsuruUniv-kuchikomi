<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12"> </v-col>
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
