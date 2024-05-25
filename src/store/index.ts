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
            parentId: '',
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
            localStorage.setItem('selectedItemId', item.id);
        },
        setSelectedItemsList (state: State, list: ListItem[]) {
            state.selectedItemsList = list;
            localStorage.setItem('selectedItemsList', JSON.stringify(state.selectedItemsList));
        },
        addSelectedItem (state: State, item: TreeListItem) {
            if (!state.selectedItemsList.find(i => i.id === item.id)) {
                state.selectedItemsList.push({
                    id: item.id,
                    name: item.name
                });
                localStorage.setItem('selectedItemsList', JSON.stringify(state.selectedItemsList));
            }
        }
    },
    actions: {
        async getItemsList ({ commit, dispatch, state }, payload) {
            commit('setLoading', true);
            const { selectedItemId } = payload;

            const items: ItemsListResponse = await itemsList.getItemsList();
            const resultTree: TreeListItem[] = processTreeList(items);

            if (resultTree.length) {
                commit('setTreeList', resultTree);
                if (selectedItemId) {
                    const element = await dispatch('findTreeElements', {id: selectedItemId, branch: state.treeList});
                    if (element) {
                        await dispatch('expandTreeToItem', {item: element});
                        commit('setSelectedItem', element);
                    }
                } else {
                    resultTree[0].treeCollapsed = false;
                    commit('setSelectedItem', resultTree[0]);
                }
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
        async expandTreeToItem({ dispatch, state }, payload) {
            const { item } = payload;
            if (item) {
                item.treeCollapsed = false;
                if (item?.parentId && item.parentId != "0") {
                    const element = await dispatch('findTreeElements', { id: item.parentId, branch: state.treeList });
                    if (element) await dispatch('expandTreeToItem', { item: element });
                }
            }
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