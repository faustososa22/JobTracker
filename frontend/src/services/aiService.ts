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

export const streamJobCoachAsync = async (question: string, conversationId: string, onChunk: (chunk: string) => void ): Promise<void> => {
    try{
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/job-coach-stream`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, conversationId })
        })

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const chunk = line.replace('data: ', '').replace(/\\n/g, '\n');
                    onChunk(chunk);
                }
            }
        }

    }catch(error){
        console.error(error)
    }
}

export const indexCvAsync = async (cvText: string): Promise<void> => {
    await api.post('/ai/index-cv', cvText, {
        headers: { 'Content-Type': 'application/json' }
    })
}

