import { api } from '@api/api'
import { ProductResponse } from '@shared/schemas/product'

export const useProductsApi = () => {
  const updateProduct = async (id: number, data: FormData) => {
    return api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  }

  const createProduct = async (data: FormData) => {
    return api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  }

  const deleteProducts = async (ids: number[]) => {
    await Promise.all(
      ids.map((id) =>
        api.delete<ProductResponse>(`/products/${id}`, {
          withCredentials: true,
        })
      )
    )
  }

  return { updateProduct, createProduct, deleteProducts }
}
