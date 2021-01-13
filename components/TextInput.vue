<template>
  <v-text-field
    :value="value"
    :rules="rules"
    flat
    dense
    solo
    rounded
    outlined
    clearable
    :counter="counter"
    color="primary"
    class="text-input"
    :placeholder="placeholder"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'TextInput',
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    counter: {
      type: Number
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
