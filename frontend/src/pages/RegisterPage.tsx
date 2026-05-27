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
            <div className="card p-4" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <div className="auth-logo mb-3">J</div>
                    <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>Job Tracker</h5>
                </div>
                <h4 className="fw-bold mb-4">Create account</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Lastname</label>
                        <input
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={e => setLastname(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-1">Create account</button>
                    {error && <p className="text-danger mt-2 mb-0 small">{error}</p>}
                    <p className="text-center mt-3 mb-0 small" style={{ color: '#64748b' }}>
                        Already have an account? <a href="/login" className="text-decoration-none fw-semibold" style={{ color: '#3b82f6' }}>Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
