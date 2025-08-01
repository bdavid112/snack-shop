import { api } from '@api/api'
import { UserResponse } from '@shared/schemas/user'
import { UserTable } from '@components/Table/UserTable'
import { EntityList } from '@components/EntityList'

export const UsersPage = () => {
  return (
    <EntityList<UserResponse>
      title="Users"
      fetchEntities={() =>
        api.get<UserResponse[]>('/users', { withCredentials: true }).then((res) => res.data)
      }
      renderListView={(users, selectedIds, toggleOne, toggleAll, refresh) => (
        <UserTable
          users={users}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          refreshUsers={refresh}
        />
      )}
      defaultView="list"
      allowToggle={false}
    />
  )
}
