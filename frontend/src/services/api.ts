const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Something went wrong')
  }
  return response.json()
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    return handleResponse<T>(response)
  },

  post: async <T, U>(endpoint: string, data: U): Promise<T> => {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },

  put: async <T, U>(endpoint: string, data: U): Promise<T> => {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    return handleResponse<T>(response)
  },
}
