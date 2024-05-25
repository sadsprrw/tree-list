export interface ItemsListResponseNode {
    cat?: ItemsListResponseNode | ItemsListResponseNode[],
    leaf?: ItemsListResponseNode[],
    "_nodeId": string,
    "_name": string
}


export interface ItemsListResponse {
    tree: {
        "cat": ItemsListResponseNode,
        "_treeId": string
    }
}

export interface TreeListItem {
    id: string;
    name: string;
    children: TreeListItem[];
    treeCollapsed: boolean;
}

export interface ListItem {
    id: string;
    name: string;
}