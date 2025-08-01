import { useState } from 'react'

export const useEditableEntities = <T extends { id: number }>(entities: T[] = []) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editableEntities, setEditableEntities] = useState<Record<number, Partial<T>>>({})

  const startEditing = (id: number) => {
    setEditableEntities((prev) => {
      if (prev[id]) return prev
      const entityToEdit = entities.find((e) => e.id === id)
      if (!entityToEdit) return prev

      // Clone entity without undefined fields
      const clone = Object.fromEntries(
        Object.entries(entityToEdit).filter(([_, v]) => v !== undefined)
      ) as Partial<T>

      return {
        ...prev,
        [id]: clone,
      }
    })
    setEditingId((prev) => (prev === id ? null : id))
  }

  const setField = <K extends keyof T>(id: number, field: K, value: T[K] | null) => {
    setEditableEntities((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value ?? undefined,
      },
    }))
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  return {
    editingId,
    editableEntities,
    startEditing,
    setField,
    cancelEditing,
    setEditableEntities,
  }
}
