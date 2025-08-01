import { api } from '@api/api'
import { UserResponse } from '@shared/schemas/user'
import { toFormData } from '@utils/toFormData'

export const useUsersApi = () => {
  const updateUser = async (id: number, data: Partial<UserResponse>) => {
    const formData = toFormData(data)
    return api.put(`/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  }

  const createUser = async (data: Partial<UserResponse>) => {
    const formData = toFormData(data)
    return api.post('/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  }

  const deleteUsers = async (ids: number[]) => {
    await Promise.all(
      ids.map((id) =>
        api.delete<UserResponse>(`/users/${id}`, {
          withCredentials: true,
        })
      )
    )
  }

  return { updateUser, createUser, deleteUsers }
}
