import { useEffect, useState } from "react"
import { getAllAsync } from "../services/applicationService"
import type { Application } from "../types/Application"
import { useNavigate } from "react-router-dom"
import { getStatusBadgeColor, getStatusLabel } from "../utils/statusHelpers"

export function ApplicationsPage(){
    const [applications, setApplications] = useState<Application[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchApplications = async () => {
            const result = await getAllAsync()
            if(result.data) setApplications(result.data)
        }
        fetchApplications()
    }, [])

    return(
        <div className="container mt-4">
            <h3 className="fw-bold mb-4">Job Applications</h3>

            <div className="row">
                {applications.map(app => (
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
            
        </div>
    )
}