export type ViewMode = 'grid' | 'list'

export type EntityListProps<T> = {
  title: string
  fetchEntities: () => Promise<T[]>
  renderGridItem?: (item: T) => React.ReactNode
  renderListView?: (
    items: T[],
    selectedIds: number[],
    toggleOne: (id: number) => void,
    toggleAll: () => void,
    refresh: () => void
  ) => React.ReactNode
  defaultView?: ViewMode
  allowToggle?: boolean
}
