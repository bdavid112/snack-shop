import axios from 'axios'

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api',
  withCredentials: true,
})
