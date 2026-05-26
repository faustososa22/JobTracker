import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createAsync } from "../services/applicationService"

export function CreateApplicationPage(){
    const navigate = useNavigate()

    const [ companyName, setCompanyName ] = useState('')
    const [ jobTitle, setJobTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ appliedDate, setAppliedDate ] = useState('')
    const [ error, setError ] = useState('')

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const result = await createAsync({companyName, jobTitle, description, appliedDate})
        if (result.error){
            setError(result.error)
            return
        }
        navigate('/applications')
    }
    return(
        <div className="container mt-5" style={{maxWidth: '600px'}}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h3 className="fw-bold mb-4">New Application</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Company name</label>
                            <input className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Job Title</label>
                            <input className="form-control" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Applied date</label>
                            <input type="date" className="form-control" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} required/>
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Save</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/applications')}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}