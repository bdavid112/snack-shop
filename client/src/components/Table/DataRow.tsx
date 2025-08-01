import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { FiEdit, FiCheck } from 'react-icons/fi'
import React from 'react'

export interface FieldConfig<T> {
  key: keyof T
  label?: string
  widthClass?: string
  render?: (value: any, item: T) => React.ReactNode
  input?: (value: any, onChange: (val: any) => void, item: T) => React.ReactNode
}

interface DataRowProps<T extends { id: number }> {
  item: T
  editing: boolean
  editableData: Partial<T>
  onStartEdit: (id: number) => void
  onCancelEdit: () => void
  onFieldChange: (id: number, key: keyof T, value: any) => void
  onSave: (id: number) => void
  selected: boolean
  onSelect: () => void
  fields: FieldConfig<T>[]
  leading?: React.ReactNode
}

export function DataRow<T extends { id: number }>({
  item,
  editing,
  editableData,
  onStartEdit,
  onCancelEdit,
  onFieldChange,
  onSave,
  selected,
  onSelect,
  fields,
  leading,
}: DataRowProps<T>) {
  return (
    <tr
      key={item.id}
      className="bulk"
      data-selected={selected}
      onClick={() => {
        if (!editing) onSelect()
      }}
    >
      {leading && (
        <td className="flex items-center justify-center flex-[0.75] py-2">
          <div onClick={(e) => e.stopPropagation()}>{leading}</div>
        </td>
      )}

      {fields.map(({ key, widthClass = 'flex-1', render, input }) => (
        <td key={String(key)} className={widthClass}>
          {editing ? (
            input ? (
              input(editableData[key], (val) => onFieldChange(item.id, key, val), item)
            ) : (
              <Input
                value={editableData[key] as string | number | undefined}
                size="sm"
                className="max-w-[90%]"
                onChange={(e) => onFieldChange(item.id, key, e.target.value)}
              />
            )
          ) : render ? (
            render(item[key], item)
          ) : (
            String(item[key])
          )}
        </td>
      ))}

      <td className="flex items-center justify-center flex-[0.5]">
        <div onClick={(e) => e.stopPropagation()}>
          {editing ? (
            <Button variant="ghost" size="sm" type="button" onClick={() => onSave(item.id)}>
              <FiCheck size={16} />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" type="button" onClick={() => onStartEdit(item.id)}>
              <FiEdit size={16} />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
