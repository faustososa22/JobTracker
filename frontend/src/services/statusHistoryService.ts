import type { ApiResult } from "../types";
import type { StatusHistory } from "../types/StatusHistory";
import api from "./api";

export const getByApplicationId = async (applicationId: number): Promise<ApiResult<StatusHistory[]>> => {
    try{
        const response = await api.get(`/statushistories?applicationId=${applicationId}`)
        return { data: response.data}

    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
} 

export const createStatus = async (statusHistory: StatusHistory): Promise<ApiResult<StatusHistory>> => {
    try{
        const response = await api.post('/statushistories', statusHistory)
        return { data: response.data}

    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

export const deleteStatus = async (statusId: number): Promise<ApiResult<void>> => {
    try{
        const response = await api.delete(`/statushistories/${statusId}`)
        return { data: response.data}

    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
} 