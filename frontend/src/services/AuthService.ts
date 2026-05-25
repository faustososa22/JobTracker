import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const login = async (email: string, password: string): Promise<string | null> =>{
    try{
        const response = await api.post('/auth/login', {email, password})
        return response.data.token
    }catch(error){
        console.log(error.response?.data)
        return null
    }
    
}

export const register = async (name: string, lastname: string, email: string, password: string): Promise<string | null> => {
    try {
      const response = await api.post('/auth/register', { name, lastName: lastname, email, passwordHash: password })
      return response.data.token
    } catch (error) {
      console.log(error.response?.data)
      return null
    }
  }