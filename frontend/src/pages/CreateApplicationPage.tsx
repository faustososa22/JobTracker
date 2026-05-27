import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createAsync } from "../services/applicationService"

export function CreateApplicationPage(){
    const navigate = useNavigate()

    const [companyName, setCompanyName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [description, setDescription] = useState('')
    const [appliedDate, setAppliedDate] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const result = await createAsync({companyName, jobTitle, description, appliedDate})
        if (result.error){
            setError(result.error)
            return
        }
        navigate('/applications')
    }

    return (
        <div className="container" style={{ maxWidth: '560px', paddingTop: '32px', paddingBottom: '48px' }}>
            <button
                className="btn btn-sm"
                style={{ fontSize: '13px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', marginBottom: '20px' }}
                onClick={() => navigate('/applications')}
            >
                ← Back
            </button>

            <div className="card p-4">
                <h5 style={{ fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>New application</h5>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Fill in the details of the job you applied for.</p>

                {error && <div className="alert alert-danger mb-3">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Company name</label>
                        <input className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Job title</label>
                        <input className="form-control" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Applied date</label>
                        <input type="date" className="form-control" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>Save</button>
                        <button type="button" className="btn btn-sm" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', padding: '8px 16px' }} onClick={() => navigate('/applications')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
