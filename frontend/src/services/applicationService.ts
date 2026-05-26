import type { ApiResult } from "../types";
import type { Application } from "../types/Application";
import api from "./api";

export const getAllAsync = async (): Promise<ApiResult<Application[]>> => {
    try{
        const response = await api.get('/applications')
        return {data: response.data}
    }catch (error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

export const getByIdAsync = async (id: number): Promise<ApiResult<Application>> => {
    try{
        const response = await api.get(`/applications/${id}`)
        return { data: response.data}

    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

export const createAsync = async (application: Application): Promise<ApiResult<Application>> => {
    try{
        const response = await api.post('/applications', application)
        return {data: response.data}
    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

export const updateAsync = async (application: Application): Promise<ApiResult<Application>> => {
    try{
        const response = await api.put(`/applications/${application.id}`, application)
        return {data: response.data}
    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

export const deleteAsync = async (id: number): Promise<ApiResult<void>> => {
    try{
        const response = await api.delete(`/applications/${id}`)
        return {data: response.data}
    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

