<template>
  <v-select
    :value="value"
    :items="items"
    :rules="rules"
    :disabled="disabled"
    :placeholder="placeholder"
    flat
    solo
    dense
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
  name: 'SelectInput',
  props: {
    value: {
      type: String
    },
    items: {
      type: Array,
      required: true
    },
    rules: {
      type: Array,
      required: false
    },
    disabled: {
      type: Boolean
    },
    placeholder: {
      type: String
    }
  }
})
</script>
