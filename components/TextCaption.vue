<template>
  <div class="required-caption text-caption pl-3">
    <span v-if="required" class="red--text">* </span>
    <!-- TODO: これslotでいい気がする -->
    <slot />
    {{ title }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'TextCaption',
  props: {
    title: {
      type: String
    },
    required: {
      type: Boolean
    }
  },
  setup() {}
})
</script>

<style scoped></style>
