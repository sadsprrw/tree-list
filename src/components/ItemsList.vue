<template>
  <div v-if="!!itemsData.length" class="list">
    <ul>
      <li v-for="item in itemsData" :key="`list-node-${item.id}`">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ListItem } from "@/common/types/types";

export default defineComponent({
  name: 'ItemsList',
  props: {
    itemsData: {
      type: Object as PropType<Array<ListItem>>,
      required: true
    }
  },
  setup (props) {

  }
})
</script>
<style scoped lang="scss">

</style>