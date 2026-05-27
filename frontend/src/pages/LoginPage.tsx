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
            <div style={{ width: '100%', maxWidth: '380px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div className="auth-logo" style={{ margin: '0 auto 12px' }}>J</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Job Tracker</p>
                </div>

                <div className="card p-4">
                    <h4 style={{ fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>Sign in</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Welcome back</p>

                    {error && <div className="alert alert-danger mb-3">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ padding: '10px' }}>Sign in</button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '20px', marginBottom: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                        No account?{' '}
                        <a href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Create one</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
