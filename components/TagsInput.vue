<template>
  <!-- タグを入力するコンボボックス -->
  <v-combobox
    :value="value"
    :items="items"
    :rules="rules"
    :placeholder="placeholder"
    :counter="counter"
    dense
    multiple
    outlined
    clearable
    class="tags-input"
    @change="$emit('input', $event)"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        :color="data.item.color"
        small
        dense
        close
        text-color="white"
        @click:close="data.parent.selectItem(data.item)"
      >
        {{ data.item.text }}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
interface Tag {
  text: string
  value: string
  color: string // チップの色
}

export default defineComponent({
  name: 'TagsInput',
  props: {
    value: {
      type: Array as PropType<Tag[]>
    },
    items: {
      type: Array as PropType<Tag[]>,
      required: true
    },
    rules: {
      type: Array
    },
    placeholder: {
      type: String
    },
    counter: {
      type: String
    }
  }
})
</script>
