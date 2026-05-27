import { useState} from "react"
import { login } from "../services/AuthService"
import { useNavigate } from "react-router-dom"

export function LoginPage(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        setError('')
        e.preventDefault()
        if(!email || !password){
            setError('All fields are required')
            return
        }
        const result = await login(email, password)
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
                <h4 className="fw-bold mb-4">Sign in</h4>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="btn btn-primary w-100 mt-1">Sign in</button>
                    {error && <p className="text-danger mt-2 mb-0 small">{error}</p>}
                    <p className="text-center mt-3 mb-0 small" style={{ color: '#64748b' }}>
                        Don't have an account? <a href="/register" className="text-decoration-none fw-semibold" style={{ color: '#3b82f6' }}>Register</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
