<template>
  <v-btn
    v-bind="$attrs"
    small
    rounded
    :depressed="depressed"
    color="primary"
    class="filtering-btn pa-0"
    @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'FilteringBtn',
  props: {
    depressed: {
      type: Boolean
    }
  }
})
</script>
