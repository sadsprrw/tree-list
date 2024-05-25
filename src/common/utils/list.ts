import {
    ItemsListResponseNode,
    ItemsListResponse,
    TreeListItem
} from "@/common/types/types";

function processTreeNode(node: ItemsListResponseNode) : TreeListItem {
    const resultItem: TreeListItem = {
        id: node._nodeId,
        name: node._name,
        children: [],
        treeCollapsed: true
    }
    if (!node?.cat && !node?.leaf) return resultItem;

    if (node?.leaf) {
        resultItem.children = node.leaf.map(item => processTreeNode(item));
        return resultItem;
    }

    if (Array.isArray(node.cat)) {
        resultItem.children = node.cat.map(item => processTreeNode(item));
    }
    else if (typeof node.cat === 'object' && node.cat !== null) {
        resultItem.children = [processTreeNode(node.cat)];
    }
    return resultItem;
}

export function processTreeList(tree: ItemsListResponse) : TreeListItem[] {
    if (tree?.tree?.cat) return [processTreeNode(tree.tree.cat)];
    return [];
}