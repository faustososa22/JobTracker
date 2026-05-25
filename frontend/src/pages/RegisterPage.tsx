import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../services/AuthService"

export function RegisterPage(){

    const [name, setName] = useState('')
    const [lastName, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const token = await register(name, lastName, email, password)
        if (token){
            localStorage.setItem('token', token)
            navigate('/applications')
        }else{
            alert('Internal Error')
        }
    }

    return(
        <div className="d-flex align-items-center justify-content-center vh-100">

            <div className="card shadow p-4" style={{width: '400px'}}>
            <h4 className="text-center mb-4 fw-bold">Job Tracker</h4>
            <h2 className="mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="name" 
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Lastname</label>
                    <input 
                        type="lastname" 
                        className="form-control"
                        value={lastName}
                        onChange={e => setLastname(e.target.value)}/>
                </div>
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
                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            </div>
            
        </div>
    )
}