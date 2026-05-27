import { useEffect, useState } from "react"
import { deleteAsync, getAllAsync } from "../services/applicationService"
import type { Application } from "../types/Application"
import { useNavigate } from "react-router-dom"
import { getStatusBadgeColor, getStatusLabel } from "../utils/statusHelpers"
import { ApplicationStatus } from "../types/ApplicationStatus"
import Swal from "sweetalert2"

export function ApplicationsPage(){
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchApplications = async () => {
            const result = await getAllAsync()
            if(result.data) setApplications(result.data)
            setLoading(false)
        }
        fetchApplications()
    }, [])

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        const confirm = await Swal.fire({
            title: 'Delete application?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        })
        if (!confirm.isConfirmed) return
        await deleteAsync(id)
        setApplications(prev => prev.filter(app => app.id !== id))
    }

    const filtered = selectedStatus === null
        ? applications
        : applications.filter(app => app.status === selectedStatus)

    return (
        <div className="container" style={{ maxWidth: '1100px', paddingTop: '32px', paddingBottom: '48px' }}>
            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '2px', letterSpacing: '-0.02em' }}>Applications</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        {applications.length} total
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                        className="form-select form-select-sm"
                        value={selectedStatus ?? ''}
                        onChange={e => setSelectedStatus(e.target.value === '' ? null : parseInt(e.target.value))}
                        style={{ width: '140px' }}
                    >
                        <option value="">All statuses</option>
                        <option value={ApplicationStatus.Applied}>Applied</option>
                        <option value={ApplicationStatus.Interviewing}>Interviewing</option>
                        <option value={ApplicationStatus.Offered}>Offered</option>
                        <option value={ApplicationStatus.Rejected}>Rejected</option>
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/applications/create')} style={{ whiteSpace: 'nowrap' }}>
                        + New
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
                    <div className="spinner-border text-primary" style={{ width: '2rem', height: '2rem' }} role="status" />
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
                    <div style={{ width: '40px', height: '3px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '14px', margin: 0 }}>
                        {applications.length === 0 ? "No applications yet. Add your first one." : "No applications match the selected filter."}
                    </p>
                </div>
            ) : (
                <div className="row g-3">
                    {filtered.map(app => (
                        <div key={app.id} className="col-md-4">
                            <div
                                className="card app-card h-100"
                                style={{ cursor: 'pointer', padding: '20px' }}
                                onClick={() => navigate(`/applications/${app.id}`)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <span className={`badge ${getStatusBadgeColor(app.status)}`}>
                                        {getStatusLabel(app.status)}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {new Date(app.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>

                                <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px', letterSpacing: '-0.01em' }}>{app.companyName}</p>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>{app.jobTitle}</p>

                                <p style={{
                                    fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5,
                                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                }}>
                                    {app.description}
                                </p>

                                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                                    <button
                                        className="btn btn-sm"
                                        style={{ fontSize: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', padding: '3px 10px' }}
                                        onClick={e => { e.stopPropagation(); navigate(`/applications/${app.id}/edit`) }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        style={{ fontSize: '12px', border: '1px solid #fecaca', color: '#b91c1c', background: 'transparent', padding: '3px 10px' }}
                                        onClick={e => handleDelete(e, app.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
