<template>
  <div>
    <div v-if="loading">
      <div>Loading...</div>
    </div>
    <div v-else class="panel">
      <div class="panel__left-side">
        <div class="tree-actions">
          <div class="tree-actions--item" @click="expand">Expand</div>
          <div class="tree-actions--item" @click="collapse">Collapse</div>
        </div>
        <TreeList :items-data="treeList"/>
      </div>
      <div class="panel__right-side">
        <div class="list--header">
          Selected items:
          <div class="tree-actions--item" @click="clearSelectedList">Clear</div>
        </div>
        <ItemsList :items-data="selectedItemsList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from 'vuex'
import TreeList from "@/components/TreeList.vue";
import ItemsList from "@/components/ItemsList.vue";

export default defineComponent({
  name: 'App',
  components: { TreeList, ItemsList },
  setup() {
    const store = useStore();

    const loading = computed(() => store.state.loading);
    const treeList = computed(() => store.state.treeList);
    const selectedItemsList = computed(() => store.state.selectedItemsList);

    onMounted(() => {
      const selectedItemId = localStorage.getItem('selectedItemId');
      const savedList = localStorage.getItem('selectedItemsList');

      if (savedList) {
        try {
          const parsedList = JSON.parse(savedList);
          store.commit('setSelectedItemsList', parsedList);
        } catch (e) {
          console.error(e);
        }
      }

      store.dispatch('getItemsList', { selectedItemId });
    });

    async function expand() {
      await store.dispatch('updateFullBranch', { item: store.state.selectedItem, value: false });
    }

    async function collapse() {
      await store.dispatch('updateFullBranch', { item: store.state.selectedItem, value: true });
    }

    function clearSelectedList() {
      store.commit('setSelectedItemsList', []);
    }

    return { loading, treeList, selectedItemsList, expand, collapse, clearSelectedList };
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

.panel {
  display: grid;
  height: calc(100vh - 100px);
  margin: 50px;
  border: 1px solid #9f9f9f;
  border-radius: 10px;
  grid-template-columns: 600px 1fr;

  &__left-side {
    overflow-y: auto;
    border-right: 1px solid #9f9f9f;
  }

  &__right-side {
    overflow-y: auto;
  }
}

.list {

  &--header {
    margin: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
