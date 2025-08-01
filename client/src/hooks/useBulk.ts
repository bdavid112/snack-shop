import { useState } from 'react'

export const useBulk = <T extends { id: number }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const toggleAll = () => {
    const allSelected = selectedIds.length === items.length
    setSelectedIds(allSelected ? [] : items.map((item) => item.id))
  }

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const isSelected = (id: number) => selectedIds.includes(id)

  const clear = () => setSelectedIds([])

  return {
    selectedIds,
    isSelected,
    toggleAll,
    toggleOne,
    clear,
  }
}
