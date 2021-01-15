<template>
  <div class="required-caption text-caption my-1 ml-3">
    <span class="red--text">* </span>
    <slot />
    {{ title }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'RequiredCaption',
  props: {
    title: {
      type: String
    }
  },
  setup() {}
})
</script>

<style scoped></style>
