import { useEffect, useState } from "react"
import { getAllAsync } from "../services/applicationService"
import type { Application } from "../types/Application"
import { useNavigate } from "react-router-dom"
import { getStatusBadgeColor, getStatusLabel } from "../utils/statusHelpers"
import { ApplicationStatus } from "../types/ApplicationStatus"

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
                    {filtered.map(app => (
                        <div key={app.id} className="col-md-4 mb-3">
                            <div className="card mb-3 shadow-sm h-100" style={{cursor: 'pointer'}} onClick={() => navigate(`/applications/${app.id}`)}>
                                <div className="card-body">
                                    <h5 className="card-title">{app.companyName}</h5>
                                    <p className="card-text text-muted">{app.jobTitle}</p>
                                    <p className="card-text text-muted small mt-2" style={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>{app.description}</p>
                                    <p className="card-text me-4">
                                        <small className="text-muted">Applied: {new Date(app.appliedDate).toLocaleDateString('en-GB')}</small>
                                    </p>
                                    <span className={`badge ${getStatusBadgeColor(app.status)}`}>{getStatusLabel(app.status)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            
        </div>
    )
}