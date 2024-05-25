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
import { computed, defineComponent} from 'vue'
import {useStore} from "vuex";

export default defineComponent({
  name: 'ItemsList',
  setup () {
    const store = useStore();

    const itemsData = computed(() => store.state.selectedItemsList);

    return {
      itemsData
    }
  }
})
</script>
<style scoped lang="scss">

</style>