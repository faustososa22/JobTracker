import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {  getByIdAsync, updateAsync } from "../services/applicationService"

export function EditApplicationPage(){
    const navigate = useNavigate()
    const { id } = useParams()

    const [ companyName, setCompanyName ] = useState('')
    const [ jobTitle, setJobTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ appliedDate, setAppliedDate ] = useState('')
    const [ error, setError ] = useState('')

    useEffect(() => {
        const fetchApplication = async () => {
            const result = await getByIdAsync(parseInt(id!))
            if (result.data) {
                setCompanyName(result.data.companyName)
                setJobTitle(result.data.jobTitle)
                setDescription(result.data.description)
                setAppliedDate(result.data.appliedDate.split('T')[0])
            }
        }
        fetchApplication()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await getByIdAsync(parseInt(id!))
        if (!result.data) return
        const updated = await updateAsync({ ...result.data, companyName, jobTitle, description, appliedDate })
        if (updated.error) {
            setError(updated.error)
            return
        }
        navigate(`/applications`)
    }
    
    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h4 className="fw-bold mb-4">Edit Application</h4>
                    <p className="text-muted mb-4">Update the details of your application.</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Company Name</label>
                            <input className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Job Title</label>
                            <input className="form-control" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Applied Date</label>
                            <input type="date" className="form-control" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} required />
                        </div>
                        <div className="d-flex gap-2 mt-4">
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(`/applications/`)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}