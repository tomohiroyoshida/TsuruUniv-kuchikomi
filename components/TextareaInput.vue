<template>
  <v-textarea
    :value="value"
    class="textarea-input"
    :rules="rules"
    flat
    solo
    dense
    rounded
    outlined
    clearable
    no-resize
    height="130"
    counter="1000"
    color="primary"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'TextareaInput',
  props: {
    value: {
      type: String,
      required: false
    },
    rules: {
      type: Array,
      required: true
    }
  },
  setup() {}
})
</script>

<style scoped></style>
