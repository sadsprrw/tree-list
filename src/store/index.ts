import { createStore } from "vuex";
import {
    ItemsListResponse,
    TreeListItem,
    ListItem
} from "@/common/types/types";
import { processTreeList } from "@/common/utils/list";

import itemsList from "@/api/itemsList";

export interface State {
    loading: boolean;
    treeList: TreeListItem[];
    selectedItemsList: ListItem[];
    selectedItem: TreeListItem;
}

export default createStore<State>({
    state: {
        loading: false,
        treeList: [],
        selectedItemsList: [],
        selectedItem: {
            id: '',
            name: '',
            children: [],
            treeCollapsed: false
        }
    },
    getters: {},
    mutations: {
        setLoading (state: State, value: boolean) {
          state.loading = value;
        },
        setTreeList (state: State, tree: TreeListItem[]) {
            state.treeList = tree;
        },
        setSelectedItem (state: State, item: TreeListItem) {
            state.selectedItem = item;
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
            commit('setLoading', true);

            const items: ItemsListResponse = await itemsList.getItemsList();
            const resultTree: TreeListItem[] = processTreeList(items);

            if (resultTree.length) {
                resultTree[0].treeCollapsed = false;
                commit('setSelectedItem', resultTree[0]);
                commit('setTreeList', resultTree);
            }

            commit('setLoading', false);
        },
        async findTreeElements ({ dispatch }, payload) {
            const { id, branch } = payload;
            for (let i = 0; i < branch.length; i++) {
                if (branch[i].id === id) {
                    return branch[i];
                }
                if (branch[i].children) {
                    const element = await dispatch('findTreeElements', { id, branch: branch[i].children });
                    if (element) {
                        return element;
                    }
                }
            }
            return null;
        },
        async replaceTreeElements ({ dispatch }, payload) {
            const { id, branch, replaceItem } = payload;
            for (let i = 0; i < branch.length; i++) {
                if (branch[i].id === id) {
                    branch[i] = replaceItem;
                    return true;
                }
                if (branch[i].children) {
                    const isReplaced = await dispatch('replaceTreeElements', { id, branch: branch[i].children, replaceItem });
                    if (isReplaced) {
                        return true;
                    }
                }
            }
            return false;
        },
        async updateTreeElement ({ dispatch, state }, payload) {
            const { id, attributes } = payload;
            const item = await dispatch('findTreeElements', { id, branch: state.treeList });
            let newItem;
            if (item) newItem = { ...item, ...attributes };

            await dispatch('replaceTreeElements', { id, branch: state.treeList, replaceItem: newItem });
        },
        async updateFullBranch ({ dispatch, state }, { item, value }) {
            if (item) {
                item.treeCollapsed = value;
                if (item?.children)
                    item.children.forEach((i: TreeListItem) => dispatch('updateFullBranch', { item: i, value }))
            }
        }
    },
    modules: {},
});