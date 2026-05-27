import { useState } from "react";
import type { CvMatchResults } from "../types/CvMatchResults";
import { cvMatchAsync } from "../services/aiService";

export function CvMatchPage(){
    const [jobOfferText, setJobOfferText] = useState('')
    const [cvText, setCvText] = useState('')
    const [cvFile, setCvFile] = useState<File | undefined>(undefined)
    const [usePdf, setUsePdf] = useState(false)
    const [result, setResult] = useState<CvMatchResults | undefined>(undefined)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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

    const scoreColor = result
        ? result.matchScore >= 70 ? '#166534' : result.matchScore >= 40 ? '#b45309' : '#b91c1c'
        : 'var(--accent)'

    const scoreBg = result
        ? result.matchScore >= 70 ? '#f0fdf4' : result.matchScore >= 40 ? '#fffbeb' : '#fef2f2'
        : 'var(--accent-light)'

    return (
        <div className="container" style={{ maxWidth: '680px', paddingTop: '32px', paddingBottom: '48px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>CV Match</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Paste a job offer and your CV to get an AI-powered match score with strengths and suggestions.
                </p>
            </div>

            <div className="card p-4 mb-3">
                {error && <div className="alert alert-danger mb-3">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label">Job offer</label>
                        <textarea className="form-control" rows={5} value={jobOfferText} onChange={e => setJobOfferText(e.target.value)} required placeholder="Paste the full job description here..." />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Your CV</label>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <input className="form-check-input" type="radio" checked={!usePdf} onChange={() => setUsePdf(false)} style={{ margin: 0 }} />
                                Paste text
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <input className="form-check-input" type="radio" checked={usePdf} onChange={() => setUsePdf(true)} style={{ margin: 0 }} />
                                Upload PDF
                            </label>
                        </div>
                        {!usePdf
                            ? <textarea className="form-control" rows={5} value={cvText} onChange={e => setCvText(e.target.value)} placeholder="Paste your CV content here..." />
                            : <input type="file" className="form-control" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0])} />
                        }
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '9px 24px', minWidth: '120px' }}>
                        {loading
                            ? <span className="spinner-border spinner-border-sm" role="status" />
                            : 'Analyze'
                        }
                    </button>
                </form>
            </div>

            {result && (
                <div className="card p-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ background: scoreBg, color: scoreColor, borderRadius: '10px', padding: '12px 20px', textAlign: 'center', minWidth: '80px' }}>
                            <div style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>{result.matchScore}%</div>
                            <div style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Match</div>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{result.summary}</p>
                    </div>

                    <hr style={{ margin: '0 0 16px' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '8px' }}>Strengths</p>
                            <ul style={{ margin: 0, paddingLeft: '18px' }}>
                                {result.strengths.map((s, i) => <li key={i} style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '2px' }}>{s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#b45309', marginBottom: '8px' }}>Weaknesses</p>
                            <ul style={{ margin: 0, paddingLeft: '18px' }}>
                                {result.weaknesses.map((w, i) => <li key={i} style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '2px' }}>{w}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#166534', marginBottom: '8px' }}>Suggestions</p>
                            <ul style={{ margin: 0, paddingLeft: '18px' }}>
                                {result.suggestions.map((s, i) => <li key={i} style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '2px' }}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
