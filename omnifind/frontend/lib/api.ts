import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
})

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const { Clerk } = window as any
    if (Clerk?.session) {
      const token = await Clerk.session.getToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.error || err.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)
