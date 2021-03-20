<template>
  <v-text-field
    v-bind="$attrs"
    :value="$attrs.value"
    :rules="$attrs.rules"
    :counter="$attrs.counter"
    :readonly="$attrs.readonly"
    :placeholder="$attrs.placeholder"
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
  name: 'TextInput'
})
</script>
