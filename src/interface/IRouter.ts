interface MenuItem {
  path?: string
  name: string
  page: string
  icon?: string
  children?: MenuItem[]
}

export type { MenuItem }
