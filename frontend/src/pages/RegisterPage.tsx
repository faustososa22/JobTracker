import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../services/AuthService"

export function RegisterPage(){

    const [name, setName] = useState('')
    const [lastName, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        setError('')
        e.preventDefault()
        if(!name || !lastName || !email || !password){
            setError('All fields are required')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        const result = await register(name, lastName, email, password)
        if (result.token){
            localStorage.setItem('token', result.token)
            navigate('/applications')
        }else{
            setError(result.error ?? 'Something went wrong.')
        }
    }

    return (
        <div className="auth-wrapper">
            <div style={{ width: '100%', maxWidth: '380px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div className="auth-logo" style={{ margin: '0 auto 12px' }}>J</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Job Tracker</p>
                </div>

                <div className="card p-4">
                    <h4 style={{ fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>Create account</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Start tracking your applications</p>

                    {error && <div className="alert alert-danger mb-3">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label">First name</label>
                                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="col-6">
                                <label className="form-label">Last name</label>
                                <input type="text" className="form-control" value={lastName} onChange={e => setLastname(e.target.value)} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ padding: '10px' }}>Create account</button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '20px', marginBottom: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
