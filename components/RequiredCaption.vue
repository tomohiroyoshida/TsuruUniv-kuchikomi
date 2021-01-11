<template>
  <div class="required-caption text-caption my-1 ml-3">
    <span class="red--text">* </span>
    {{ title }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'RequiredCaption',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {}
})
</script>

<style scoped></style>
