import { api } from '@api/api'
import { OrderResponse } from '@shared/schemas/order'

export const useOrdersApi = () => {
  const getOrders = async () => {
    return api.get<OrderResponse[]>('/orders', {
      withCredentials: true,
    })
  }

  const updateOrder = async (id: number, data: FormData) => {
    return api.put(`/orders/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  }

  const createOrder = async (data: FormData) => {
    return api.post('/orders', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  }

  const deleteOrders = async (ids: number[]) => {
    await Promise.all(
      ids.map((id) =>
        api.delete<OrderResponse>(`/orders/${id}`, {
          withCredentials: true,
        })
      )
    )
  }

  return { getOrders, updateOrder, createOrder, deleteOrders }
}
