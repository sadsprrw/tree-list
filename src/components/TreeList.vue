<template>
  <div v-if="!!itemsData.length" class="tree-list">
    <div v-for="(item, index) in itemsData" :key="`tree-node${item.id}`">
      <div
          class="tree-list__item"
      >
        <svg
            class="tree-list__icon" viewBox="0 2 20 20"
            @click="processItem(item)"
        >
          <path v-if="item.treeCollapsed" :d="arrowRight"/>
          <path v-else :d="arrowDown"/>
        </svg>

        <div
            :id="index"
            class="tree-list__name"
            :class="selectedItem.id === item.id ? 'tree-list__name--selected' : ''"
            @click="selectItem(item)"
            @dblclick="expandItem(item)"
        >
          {{ item.name }}, {{item.id}}
        </div>
      </div>
      <TreeList
          class="tree-list--nested"
          v-show="!item.treeCollapsed"
          :items-data="item.children"
      />
      <div v-show="!item.children.length && !item.treeCollapsed" class="tree-list tree-list--nested">
        <div>
          <div class="tree-list__item--action">Direct sale</div>
          <div class="tree-list__item--action">Distributors</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'

import { TreeListItem } from "@/common/types/types";
import { Icons } from "@/common/enums/icons";
import { useStore } from "vuex";

export default defineComponent({
  name: 'TreeList',
  props: {
    itemsData: {
      type: Object as PropType<Array<TreeListItem>>,
      required: true
    }
  },
  setup (props) {
    const store = useStore();
    const selectedItem = computed(() => store.state.selectedItem);

    function processItem(item: TreeListItem) {
      //store.dispatch('updateTreeElement', { id: item.id, attributes: { treeCollapsed: !item.treeCollapsed }});
      item.treeCollapsed = !item.treeCollapsed;
    }

    function selectItem(item: TreeListItem) {
      store.commit('setSelectedItem', item);
      store.commit('addSelectedItem', item);
    }

    function expandItem(item: TreeListItem) {
      item.treeCollapsed = false;
      item.children.forEach((i) => i.treeCollapsed = false);
    }

    return {
      arrowDown: Icons.arrowDown,
      arrowRight: Icons.arrowRight,
      selectedItem,
      processItem,
      selectItem,
      expandItem
    };
  }
})
</script>
<style scoped lang="scss">
.tree-list {
  margin-left: 15px;

  &--nested {
    border-left: 1px solid #9f9f9f;
  }
  &__item {
    display: flex;
    height: 30px;
    align-items: center;
    gap: 3px;

    &--action {
      display: flex;
      height: 30px;
      align-items: center;
      padding-left: 30px;
      color: #0080ff;
    }
  }

  &__icon {
    vertical-align: center;
    padding-left: 4px;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  &__name {
    cursor: pointer;
    user-select: none;
    padding: 5px 5px;

    &--selected {
      background-color: #cccccc;
    }
  }

}
</style>