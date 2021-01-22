<template>
  <v-textarea
    :value="value"
    :rules="rules"
    :placeholder="placeholder"
    flat
    solo
    dense
    outlined
    clearable
    no-resize
    height="130"
    counter="1000"
    color="primary"
    class="textarea-input"
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
    placeholder: {
      type: String
    },
    rules: {
      type: Array
    }
  },
  setup() {}
})
</script>

<style scoped></style>
