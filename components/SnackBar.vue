<template>
  <v-snackbar
    :value="value"
    :color="color"
    text
    bottom
    rounded
    timeout="4000"
    class="snack-bar"
  >
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn text fab small v-bind="attrs" @click="$emit('input', false)">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'SnackBar',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped></style>
