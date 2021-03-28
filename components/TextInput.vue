<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :rules="rules"
    :counter="counter"
    :readonly="readonly"
    :placeholder="placeholder"
    :hint="$attrs.hint"
    persistent-hint
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
    counter: {
      type: Number
    },
    placeholder: {
      type: String
    },
    hint: {
      type: String
    },
    rules: {
      type: Array
    },
    readonly: {
      type: Boolean
    }
  }
})
</script>
