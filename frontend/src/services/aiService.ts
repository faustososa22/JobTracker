import type { ApiResult } from "../types";
import type { CvMatchResults } from "../types/CvMatchResults";
import type { ApplicationInsightsResults } from "../types/ApplicationInsightsResults";
import api from "./api";

export const cvMatchAsync = async (jobOfferText: string, cvText?: string, cvFile?: File): Promise<ApiResult<CvMatchResults>> => {
    try{
        const formData = new FormData()
        formData.append('jobOfferText', jobOfferText)
        if (cvText) formData.append('cvText', cvText)
        if (cvFile) formData.append('cvFile', cvFile)
        
        const response = await api.post('/ai/cv-match', formData)
        return {data: response.data}
    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}

export const getApplicationInsightsAsync = async (applicationId: number): Promise<ApiResult<ApplicationInsightsResults>> => {
    try{
        const response = await api.get(`/ai/application-insights/${applicationId}`)
        return {data: response.data}
    }catch(error){
        return {error: error.response?.data?.message ?? 'Something went wrong'}
    }
}