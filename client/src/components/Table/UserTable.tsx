import {
  FieldConfig,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
  UserTableProps,
} from '@components/Table'
import { Button } from '@components/Button'
import { CheckBox } from '@components/CheckBox'
import { DataRow } from './DataRow'
import { EditableRow } from './EditableRow'
import { useEditableEntities } from '@hooks/useEditableEntities'
import { useUsersApi } from '@hooks/useUsersApi'
import { SafeUser } from '@shared/schemas/user'

export const UserTable = ({
  users,
  selectedIds,
  onToggleOne,
  onToggleAll,
  refreshUsers,
}: UserTableProps) => {
  const { editingId, editableEntities, startEditing, setField, cancelEditing } =
    useEditableEntities(users)
  const { updateUser, createUser, deleteUsers } = useUsersApi()

  const handleSave = async (id: number) => {
    const updated = editableEntities[id]
    if (!updated) return

    try {
      await updateUser(id, updated)
      refreshUsers()
      cancelEditing()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreate = async (data: Partial<SafeUser>) => {
    try {
      await createUser(data)
      refreshUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) return
    try {
      await deleteUsers(selectedIds)
      refreshUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const userFields: FieldConfig<Partial<SafeUser>>[] = [
    { key: 'username', placeholder: 'Username', widthClass: 'flex-[2]' },
    {
      key: 'isAdmin',
      inputType: 'checkbox',
      label: 'Admin?',
      widthClass: 'flex-[1]',
    },
    {
      key: 'authenticated',
      inputType: 'checkbox',
      label: 'Authenticated?',
      widthClass: 'flex-[1]',
    },
  ]

  return (
    <form>
      <Table variant="elevated">
        <TableHeader
          allSelected={users.length > 0 && selectedIds.length === users.length}
          onSelectAll={onToggleAll}
        >
          <TableRow bulk header>
            <td className="flex-[0.5]"></td>
            <th className="flex-[2]">Username</th>
            <th className="flex-[1]">Admin</th>
            <th className="flex-[1]">Authenticated</th>
            <th className="flex-[0.5]"></th>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const editing = editingId === user.id
            const editableData = editableEntities[user.id] || user
            const selected = selectedIds.includes(user.id)

            if (editing) {
              return (
                <EditableRow<Partial<SafeUser>>
                  key={user.id}
                  initialData={editableData}
                  fields={userFields}
                  onSubmit={async () => await handleSave(user.id)}
                />
              )
            }

            return (
              <DataRow<SafeUser>
                key={user.id}
                item={user}
                editableData={editableData}
                editing={false}
                selected={selected}
                onSelect={() => onToggleOne(user.id)}
                onStartEdit={() => startEditing(user.id)}
                onCancelEdit={cancelEditing}
                onFieldChange={setField}
                onSave={handleSave}
                fields={[
                  { key: 'username', widthClass: 'flex-[2]', render: (v) => v },
                  {
                    key: 'isAdmin',
                    widthClass: 'flex-[1]',
                    render: (v) => (v ? 'Yes' : 'No'),
                  },
                  {
                    key: 'authenticated',
                    widthClass: 'flex-[1]',
                    render: (v) => (v ? 'Yes' : 'No'),
                  },
                ]}
                leading={
                  <CheckBox
                    checked={selected}
                    onChange={() => onToggleOne(user.id)}
                    className="mr-2"
                  />
                }
              />
            )
          })}
        </TableBody>

        <TableFooter>
          {users.length > 0 && (
            <tr>
              <td className="w-full">
                <div className="flex items-center justify-between">
                  <small className="text-[var(--zui-text-secondary)]">
                    {`${selectedIds.length} of ${users.length} selected`}
                  </small>
                  <Button
                    variant="ghost"
                    size="sm"
                    shape="pill"
                    className="text-[var(--zui-state-error)]"
                    onClick={handleDelete}
                  >
                    Remove selected user(s)
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </TableFooter>
      </Table>
    </form>
  )
}
