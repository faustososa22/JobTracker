import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Application } from "../types/Application"
import { getByIdAsync, updateAsync } from "../services/applicationService"
import { getStatusBadgeColor, getStatusLabel } from "../utils/statusHelpers"
import type { StatusHistory } from "../types/StatusHistory"
import { createStatus, deleteStatus, getByApplicationId } from "../services/statusHistoryService"
import { ApplicationStatus } from "../types/ApplicationStatus"
import { getApplicationInsightsAsync } from "../services/aiService"
import type { ApplicationInsightsResults } from "../types/ApplicationInsightsResults"
import Swal from "sweetalert2"

export function ApplicationDetailPage(){
    const [application, setApplication] = useState<Application>()
    const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
    const [newStatus, setNewStatus] = useState<ApplicationStatus>(ApplicationStatus.Applied)
    const [newNotes, setNewNotes] = useState('')
    const [ insights, setInsights ] = useState<ApplicationInsightsResults | undefined>(undefined)
    const [ loading, setLoading ] = useState(true)
    const [loadingInsights, setLoadingInsights] = useState(false)


    const navigate = useNavigate()
    const { id } = useParams()    

    useEffect(() => {
        const fetchData = async () => {
            const [appResult, historyResult] = await Promise.all([
                getByIdAsync(parseInt(id!)),
                getByApplicationId(parseInt(id!))
            ])
            if(appResult.data) setApplication(appResult.data)
            if(historyResult.data) setStatusHistory(historyResult.data)
            setLoading(false)
        }
        fetchData()
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
        setLoadingInsights(true)
        const result = await getApplicationInsightsAsync(parseInt(id!))
        if (result.data) setInsights(result.data)
        setLoadingInsights(false)
    }

    const handleDeleteStatus = async (statusId: number) => {
        const confirmDelete = await Swal.fire({
            title: 'Delete status?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        })
        if (!confirmDelete.isConfirmed) return
        await deleteStatus(statusId)
        setStatusHistory(prev => prev.filter(e => e.id !== statusId))
    }

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status" />
        </div>
    )

    return <>
        <div className="container mt-4" style={{maxWidth: '800px'}}>
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/applications')}>Back</button>
            <div className="card shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h3 className="fw-bold">{application?.companyName}</h3>
                        <p className="text-muted fs-5">{application?.jobTitle}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className={`badge fs-6 ${getStatusBadgeColor(application?.status ?? 0)}`}>
                            {getStatusLabel(application?.status ?? 0)}
                        </span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/applications/${id}/edit`)}>Edit</button>
                    </div>
                </div>
                <hr />
                <h6 className="fw-bold">Description</h6>
                <p>{application?.description}</p>
                <p className="text-muted small">Applied: {new Date(application?.appliedDate ?? '').toLocaleDateString('en-GB')}</p>
            </div>
            <div className="card shadow-sm p-4 mt-2">
                <h5 className="fw-bold mb-3">Status History</h5>
                <p className="text-muted small mb-3">Track every stage of your application process.</p>
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
            <div className="card shadow-sm p-4 mt-2 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">AI Insights</h5>
                    <button className="btn btn-primary btn-sm" onClick={handleGetInsights} disabled={loadingInsights}>
                        {loadingInsights
                            ? <span className="spinner-border spinner-border-sm" role="status" />
                            : 'Get Insights'
                        }
                    </button>
                </div>
                {insights ? (
                    <div className="d-flex flex-column gap-3">
                        <div>
                            <h6 className="fw-semibold mb-1">Overview</h6>
                            <p className="mb-0">{insights.overview}</p>
                        </div>
                        <div>
                            <h6 className="fw-semibold mb-1">What to Expect</h6>
                            <p className="mb-0">{insights.whatToExpect}</p>
                        </div>
                        <div>
                            <h6 className="fw-semibold mb-1">Recommendations</h6>
                            <ul className="mb-0 ps-3">
                                {insights.recommendations.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted">Click "Get Insights" to analyse this application.</p>
                )}
            </div>
        </div>
    </>
}