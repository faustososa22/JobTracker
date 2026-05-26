import type { AuthResult } from "../types/AuthResult"
import api from "./api"

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