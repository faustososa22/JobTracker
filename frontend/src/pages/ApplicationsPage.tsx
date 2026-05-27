import { useEffect, useState } from "react"
import { deleteAsync, getAllAsync } from "../services/applicationService"
import type { Application } from "../types/Application"
import { useNavigate } from "react-router-dom"
import { getStatusBadgeColor, getStatusLabel } from "../utils/statusHelpers"
import { ApplicationStatus } from "../types/ApplicationStatus"
import Swal from "sweetalert2"

export function ApplicationsPage(){
    const [applications, setApplications] = useState<Application[]>([])
    const [ loading, setLoading ] = useState(true)
    const [ selectedStatus, setSelectedStatus ] = useState<number | null>(null)
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
            confirmButtonColor: '#d33',
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

    return(
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Job Applications</h3>
                <div className="d-flex gap-2">
                    <select className="form-select" value={selectedStatus ?? ''} onChange={e => setSelectedStatus(e.target.value === '' ? null : parseInt(e.target.value))}>
                        <option value="">All</option>
                        <option value={ApplicationStatus.Applied}>Applied</option>
                        <option value={ApplicationStatus.Interviewing}>Interviewing</option>
                        <option value={ApplicationStatus.Offered}>Offered</option>
                        <option value={ApplicationStatus.Rejected}>Rejected</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => navigate('/applications/create')}>New Application</button>
                </div>
            </div>
            {loading
                ? <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status" />
                </div>
                : <div className="row">
                    {filtered.length === 0
                        ? <p className="text-muted">
                            {applications.length === 0
                                ? "You haven't added any applications yet."
                                : "No applications match the selected filter."
                            }
                        </p>
                        : filtered.map(app => (
                        <div key={app.id} className="col-md-4 mb-3">
                            <div className="card mb-3 app-card h-100" style={{cursor: 'pointer'}} onClick={() => navigate(`/applications/${app.id}`)}>
                                <div className="card-body">
                                    <h5 className="card-title mb-1">{app.companyName}</h5>
                                    <p className="text-muted mb-1">{app.jobTitle}</p>
                                    <p className="card-text text-muted small mt-2" style={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>{app.description}</p>
                                    <p className="card-text mt-2">
                                        <small className="text-muted">Applied: {new Date(app.appliedDate).toLocaleDateString('en-GB')}</small>
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className={`badge ${getStatusBadgeColor(app.status)}`}>
                                            {getStatusLabel(app.status)}
                                        </span>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm btn-outline-secondary" onClick={e => { e.stopPropagation(); navigate(`/applications/${app.id}/edit`) }}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={e => handleDelete(e, app.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            
        </div>
    )
}