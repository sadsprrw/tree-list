import { createStore } from "vuex";
import {
    ItemsListResponseNode,
    ItemsListResponse,
    TreeListItem,
    ListItem
} from "@/common/types/types";
import { processTreeList } from "@/common/utils/list";

import itemsList from "@/api/itemsList";

export interface State {
    treeList: TreeListItem[];
    selectedItemsList: ListItem[];
}

export default createStore<State>({
    state: { treeList: [], selectedItemsList: [] },
    getters: {},
    mutations: {
        setTreeList (state: State, tree: TreeListItem[]) {
            state.treeList = tree;
        },
        addSelectedItem (state: State, item: TreeListItem) {
            if (!state.selectedItemsList.find(item => item.id === item.id)) {
                state.selectedItemsList.push({
                    id: item.id,
                    name: item.name
                });
            }
        }
    },
    actions: {
        async getItemsList ({ commit }) {
            const items: ItemsListResponse = await itemsList.getItemsList();
            const resultTree: TreeListItem[] = processTreeList(items);
            resultTree[0].treeCollapsed = false;
            resultTree[0].isSelected = true;
            commit('setTreeList', resultTree)
        }
    },
    modules: {},
});