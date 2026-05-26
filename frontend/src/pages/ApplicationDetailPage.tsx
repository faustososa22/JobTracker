import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Application } from "../types/Application"
import { getByIdAsync, updateAsync } from "../services/applicationService"
import { getStatusBadgeColor, getStatusLabel } from "../utils/statusHelpers"
import type { StatusHistory } from "../types/StatusHistory"
import { createStatus, deleteStatus, getByApplicationId } from "../services/statusHistoryService"
import { ApplicationStatus } from "../types/ApplicationStatus"
import { getApplicationInsightsAsync } from "../services/aiService"

export function ApplicationDetailPage(){
    const [application, setApplication] = useState<Application>()
    const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
    const [newStatus, setNewStatus] = useState<ApplicationStatus>(ApplicationStatus.Applied)
    const [newNotes, setNewNotes] = useState('')
    const [ insights, setInsights ] = useState<string | undefined>(undefined)


    const navigate = useNavigate()
    const { id } = useParams()    

    useEffect(() => {
        const fetchApplication = async () => {
            const result = await getByIdAsync(parseInt(id!))
            if(result.data) setApplication(result.data)
        }
        const fetchStatusHistory = async () => {
            const result = await getByApplicationId(parseInt(id!))
            if (result.data) setStatusHistory(result.data)
        }
        fetchApplication()
        fetchStatusHistory()
    }, [id])

    const handleAddStatus = async () => {
        const result = await createStatus({
            id: 0,
            applicationId: parseInt(id!),
            status: newStatus,
            changedAt: new Date().toISOString(),
            notes: newNotes
        })
        if (result.data){
            const updated = await getByApplicationId(parseInt(id!))
            if(updated.data) setStatusHistory(updated.data)
            setNewNotes('')
            
            if (application){
                const updatedApp = await updateAsync({...application, status: newStatus})
                if (updatedApp.data) setApplication(updatedApp.data)
            }
        }
    }

    const handleGetInsights = async () => {
        const result = await getApplicationInsightsAsync(parseInt(id!))
        if (result.data) setInsights(result.data)
    }

    const handleDeleteStatus = async (statusId: number) => {
        await deleteStatus(statusId)
        setStatusHistory(prev => prev.filter(e => e.id !== statusId))
    }

    return <>
        <div className="container mt-4" style={{maxWidth: '800px'}}>
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/applications')}>Back</button>
            <div className="card shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h3 className="fw-bold">{application?.companyName}</h3>
                        <p className="text-muted fs-5">{application?.jobTitle}</p>
                    </div>
                    <span className={`badge fs-6 ${getStatusBadgeColor(application?.status ?? 0)}`}>
                        {getStatusLabel(application?.status ?? 0)}
                    </span>
                </div>
                <hr />
                <h6 className="fw-bold">Description</h6>
                <p>{application?.description}</p>
                <p className="text-muted small">Applied: {new Date(application?.appliedDate ?? '').toLocaleDateString('en-GB')}</p>
            </div>
            <div className="card shadow-sm p-4 mt-4">
                <h5 className="fw-bold mb-3">Status History</h5>
                <div className="d-flex gap-2 mb-3">
                <select
                    className="form-select"
                    value={newStatus}
                    onChange={e => setNewStatus(parseInt(e.target.value) as ApplicationStatus)}>
                    <option value={ApplicationStatus.Applied}>Applied</option>
                    <option value={ApplicationStatus.Interviewing}>Interviewing</option>
                    <option value={ApplicationStatus.Offered}>Offered</option>
                    <option value={ApplicationStatus.Rejected}>Rejected</option>
                </select>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Notes (optional)"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddStatus}>Add</button>
            </div>
                {statusHistory.length === 0 ? (
                    <p className="text-muted">No status changes recorded.</p>
                ): (
                    <div className="d-flex flex-column gap-2">
                        {statusHistory.map(entry => (
                            <div key={entry.id} className="card border p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className={`badge ${getStatusBadgeColor(entry.status)}`}>
                                        {getStatusLabel(entry.status)}
                                    </span>
                                    <span className="text-muted small">
                                        {new Date(entry.changedAt).toLocaleString('en-GB')}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <p className="text-muted small mb-0">{entry.notes ?? ''}</p>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteStatus(entry.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="card shadow-sm p-4 mt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">AI Insights</h5>
                    <button className="btn btn-primary btn-sm" onClick={handleGetInsights}>Get Insights</button>
                </div>
                {insights
                    ? <p style={{ whiteSpace: 'pre-line' }}>{insights}</p>
                    : <p className="text-muted">Click "Get Insights" to analyse this application.</p>}
            </div>
        </div>
    </>
}