<template>
  <v-btn
    v-bind="$attrs"
    class="filtering-btn pa-0"
    color="primary"
    rounded
    small
    @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'FilteringBtn'
})
</script>
