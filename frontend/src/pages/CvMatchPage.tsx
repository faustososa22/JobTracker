import { useState } from "react";
import type { CvMatchResults } from "../types/CvMatchResults";
import { cvMatchAsync } from "../services/aiService";

export function CvMatchPage(){
    const [ jobOfferText, setJobOfferText ] = useState('')
    const [ cvText, setCvText ] = useState('')
    const [ cvFile, setCvFile ] = useState<File | undefined>(undefined)
    const [ usePdf, setUsePdf ] = useState(false)
    const [ result, setResult ] = useState<CvMatchResults | undefined>(undefined)
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError('')
        setResult(undefined)
        setLoading(true)
        const response = await cvMatchAsync(jobOfferText, usePdf ? undefined : cvText, usePdf ? cvFile : undefined)
        if (response.error) {
            setError(response.error)
        } else {
            setResult(response.data)
        }
        setLoading(false)
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            <div className="card shadow-sm">
                <div className="card-body p-4">
                    <h4 className="fw-bold mb-4">CV Match</h4>
                    <p className="text-muted mb-4">Upload your CV and a job offer to get an AI-powered match score with strengths, weaknesses, and suggestions.</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Job Offer</label>
                            <textarea className="form-control" rows={5} value={jobOfferText} onChange={e => setJobOfferText(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <div className="d-flex gap-3 mb-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" checked={!usePdf} onChange={() => setUsePdf(false)} />
                                    <label className="form-check-label">Paste CV text</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" checked={usePdf} onChange={() => setUsePdf(true)} />
                                    <label className="form-check-label">Upload PDF</label>
                                </div>
                            </div>
                            {!usePdf
                                ? <textarea className="form-control" rows={5} value={cvText} onChange={e => setCvText(e.target.value)} />
                                : <input type="file" className="form-control" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0])} />
                            }
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading
                                ? <span className="spinner-border spinner-border-sm" role="status" />
                                : 'Analyze'
                            }
                        </button>
                    </form>
                </div>
            </div>

            {result && (
                <div className="card shadow-sm mt-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Results</h5>
                        <h2 className="text-primary fw-bold">{result.matchScore}%</h2>
                        <p className="text-muted mb-4">{result.summary}</p>
                        <h6 className="fw-bold">Strengths</h6>
                        <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                        <h6 className="fw-bold">Weaknesses</h6>
                        <ul>{result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                        <h6 className="fw-bold">Suggestions</h6>
                        <ul>{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                </div>
            )}
        </div>
    )
}