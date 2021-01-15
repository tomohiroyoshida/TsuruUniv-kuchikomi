<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :rules="rules"
    :counter="counter"
    :placeholder="placeholder"
    flat
    dense
    solo
    outlined
    clearable
    color="primary"
    class="text-input"
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
      type: Array
    }
  },
  setup() {}
})
</script>

<style scoped></style>
