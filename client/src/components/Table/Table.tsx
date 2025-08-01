import clsx from 'clsx'
import { CheckBox } from '@components/CheckBox'
import {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
} from './Table.types'

export const Table = ({ variant = 'outlined', children, className, ...props }: TableProps) => (
  <table className={clsx('zui-table', `zui-table--${variant}`, className)} {...props}>
    {children}
  </table>
)

export const TableHeader = ({ className, children }: TableHeaderProps) => (
  <thead className={clsx('zui-table-header', className)}>{children}</thead>
)

export const TableRow = ({
  children,
  checked,
  onSelect,
  bulk,
  className,
  header,
}: TableRowProps) => (
  <tr className={className}>
    {bulk && header && (
      <th className="flex items-center justify-center flex-[0.1]">
        <CheckBox checked={checked} onChange={onSelect} />
      </th>
    )}
    {bulk && !header && (
      <td className="flex items-center justify-center flex-[0.1]">
        <CheckBox checked={checked} onChange={onSelect} />
      </td>
    )}
    {children}
  </tr>
)

export const TableBody = ({ children, className }: TableBodyProps) => (
  <tbody className={clsx('zui-table-body', className)}>{children}</tbody>
)

export const TableFooter = ({ children, className }: TableFooterProps) => (
  <tfoot className={clsx('zui-table-footer', className)}>{children}</tfoot>
)
