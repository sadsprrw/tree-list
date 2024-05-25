<template>
  <div>
    <h1>Hi!</h1>
    <div v-if="loading">
      <div>Loading...</div>
    </div>
    <div v-else>
      <div class="tree-actions">
        <div class="tree-actions--item" @click="expand">Expand</div>
        <div class="tree-actions--item" @click="collapse">Collapse</div>
      </div>
      <TreeList :items-data="itemsData"/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from 'vuex'
import TreeList from "@/components/TreeList.vue";

export default defineComponent({
  name: 'App',
  components: { TreeList },
  setup() {
    const store = useStore();

    const loading = computed(() => store.state.loading);
    const itemsData = computed(() => store.state.treeList);
    const selectedItem = computed(() => store.state.selectedItem);

    onMounted(() => store.dispatch('getItemsList'));

    async function expand() {
      await store.dispatch('updateFullBranch', { item: store.state.selectedItem, value: false });
    }

    async function collapse() {
      await store.dispatch('updateFullBranch', { item: store.state.selectedItem, value: true });
    }

    return { loading, itemsData, expand, collapse };
  }
});
</script>

<style scoped lang="scss">
#app {
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

.tree-actions {
  display: flex;
  gap: 10px;
  margin: 20px;

  &--item {
    color: #0080ff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
