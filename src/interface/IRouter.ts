interface MenuItem {
    path?: string;
    name: string;
    page: string;
    children?: MenuItem[];
}

export type {
    MenuItem
}
