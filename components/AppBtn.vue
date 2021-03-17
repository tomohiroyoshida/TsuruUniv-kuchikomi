<template>
  <v-btn
    v-bind="$attrs"
    :text="$attrs.text || 'text'"
    :width="$attrs.width || '10rem'"
    class="app-btn white--text"
    @click="$emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'AppBtn'
})
</script>
