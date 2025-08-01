import { InputType } from '@components/Input'
import { ProductResponse } from '@shared/schemas/product'
import { HTMLAttributes, ReactNode } from 'react'
import { SafeUser } from '@shared/schemas/user'

export interface UserTableProps {
  users: SafeUser[]
  selectedIds: number[]
  onToggleOne: (id: number) => void
  onToggleAll: () => void
  refreshUsers: () => void
}

export type TableVariant = 'outlined' | 'elevated'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  variant?: TableVariant
  children?: ReactNode
}

export interface TableHeaderProps {
  className?: string
  allSelected?: boolean
  onSelectAll?: () => void
  children?: ReactNode
}

export interface TableRowProps {
  children: ReactNode[]
  checked?: boolean
  onSelect?: () => void
  bulk?: boolean
  className?: string
  header?: boolean
}

export interface TableBodyProps {
  children?: ReactNode
  className?: string
}

export interface TableFooterProps {
  children?: ReactNode
  className?: string
}

export interface ProductTableProps {
  products?: ProductResponse[]
  selectedIds: number[]
  onToggleOne: (id: number) => void
  onToggleAll: () => void
  refreshProducts: () => void
}

export interface FieldConfig<T> {
  key: keyof T
  label?: string
  widthClass?: string
  inputType?: InputType | 'checkbox'
  placeholder?: string
  renderInput?: (
    value: any,
    onChange: (val: any) => void,
    extra?: { filePreview?: string }
  ) => React.ReactNode
  render?: (value: any, item: T) => React.ReactNode
  editable?: boolean
  accept?: string
  defaultValue?: any
  min?: number | string
  max?: number | string
}

export interface EditableRowProps<T> {
  initialData: Partial<T>
  fields: FieldConfig<T>[]
  onSubmit: (data: Partial<T>, formData?: FormData) => Promise<void> | void
}
