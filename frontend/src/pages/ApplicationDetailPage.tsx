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
    const [insights, setInsights] = useState<ApplicationInsightsResults | undefined>(undefined)
    const [loading, setLoading] = useState(true)
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
            confirmButtonColor: '#6366f1',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        })
        if (!confirmDelete.isConfirmed) return
        await deleteStatus(statusId)
        setStatusHistory(prev => prev.filter(e => e.id !== statusId))
    }

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="spinner-border text-primary" style={{ width: '2rem', height: '2rem' }} role="status" />
        </div>
    )

    return (
        <div className="container" style={{ maxWidth: '720px', paddingTop: '32px', paddingBottom: '48px' }}>
            <button
                className="btn btn-sm"
                style={{ fontSize: '13px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', marginBottom: '20px' }}
                onClick={() => navigate('/applications')}
            >
                ← Back
            </button>

            {/* Main card */}
            <div className="card p-4 mb-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>{application?.companyName}</h4>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '0' }}>{application?.jobTitle}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span className={`badge ${getStatusBadgeColor(application?.status ?? 0)}`} style={{ fontSize: '12px' }}>
                            {getStatusLabel(application?.status ?? 0)}
                        </span>
                        <button
                            className="btn btn-sm"
                            style={{ fontSize: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', padding: '3px 10px' }}
                            onClick={() => navigate(`/applications/${id}/edit`)}
                        >
                            Edit
                        </button>
                    </div>
                </div>

                <hr style={{ margin: '16px 0' }} />

                <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</p>
                <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '12px' }}>{application?.description}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Applied {new Date(application?.appliedDate ?? '').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* Status history */}
            <div className="card p-4 mb-3">
                <h6 style={{ fontWeight: 600, marginBottom: '4px', letterSpacing: '-0.01em' }}>Status History</h6>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Track every stage of your application.</p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <select
                        className="form-select form-select-sm"
                        value={newStatus}
                        onChange={e => setNewStatus(parseInt(e.target.value) as ApplicationStatus)}
                        style={{ width: '160px' }}
                    >
                        <option value={ApplicationStatus.Applied}>Applied</option>
                        <option value={ApplicationStatus.Interviewing}>Interviewing</option>
                        <option value={ApplicationStatus.Offered}>Offered</option>
                        <option value={ApplicationStatus.Rejected}>Rejected</option>
                    </select>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Notes (optional)"
                        value={newNotes}
                        onChange={e => setNewNotes(e.target.value)}
                        style={{ flex: 1, minWidth: '120px' }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={handleAddStatus}>Add</button>
                </div>

                {statusHistory.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No status changes recorded yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {statusHistory.map(entry => (
                            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <span className={`badge ${getStatusBadgeColor(entry.status)}`} style={{ flexShrink: 0 }}>
                                    {getStatusLabel(entry.status)}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>
                                    {entry.notes || '—'}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                                    {new Date(entry.changedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </span>
                                <button
                                    className="btn btn-sm"
                                    style={{ fontSize: '11px', border: '1px solid #fecaca', color: '#b91c1c', background: 'transparent', padding: '2px 8px', flexShrink: 0 }}
                                    onClick={() => handleDeleteStatus(entry.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Insights */}
            <div className="card p-4 mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h6 style={{ fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.01em' }}>AI Insights</h6>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Powered by Claude</p>
                    </div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleGetInsights}
                        disabled={loadingInsights}
                        style={{ minWidth: '110px' }}
                    >
                        {loadingInsights
                            ? <span className="spinner-border spinner-border-sm" role="status" />
                            : 'Get insights'
                        }
                    </button>
                </div>

                {insights ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '6px' }}>Overview</p>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{insights.overview}</p>
                        </div>
                        <hr style={{ margin: '0' }} />
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '6px' }}>What to Expect</p>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{insights.whatToExpect}</p>
                        </div>
                        <hr style={{ margin: '0' }} />
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '6px' }}>Recommendations</p>
                            <ul style={{ margin: 0, paddingLeft: '18px' }}>
                                {insights.recommendations.map((r, i) => (
                                    <li key={i} style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '4px' }}>{r}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        Click "Get insights" to receive AI feedback on this application.
                    </p>
                )}
            </div>
        </div>
    )
}
