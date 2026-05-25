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
        <div className="d-flex align-items-center justify-content-center vh-100">
            
            <div className="card shadow p-4" style={{width: '400px'}}>
            <h4 className=" text-center mb-4 fw-bold">Job Tracker</h4>
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                {error && <p className="text-danger mt-2">{error}</p>}

                <p className="text-center mt-3">
                    Don't have an account? <a href="/register" className="text-decoration-none fw-bold  ">Register</a>
                </p>
            </form>
            </div>

        </div>
    )
}