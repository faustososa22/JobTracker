import axios from "axios"
import type { AuthResult } from "../types/AuthResult"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const login = async (email: string, password: string): Promise<AuthResult> =>{
    try{
        const response = await api.post('/auth/login', {email, password})
        return {token: response.data.token}
    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong.'}
    }
    
}

export const register = async (name: string, lastname: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await api.post('/auth/register', { name: name, lastName: lastname, email, password: password })
      return {token: response.data.token}
    } catch (error) {
      return {error: error.response?.data?.message ?? 'Something went wrong.'}
    }
  }