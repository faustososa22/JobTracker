import { useNavigate } from "react-router-dom"

export function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="min-vh-100 bg-dark text-white d-flex flex-column justify-content-center align-items-center px-3">
            <div className="text-center mb-5">
                <div className="display-1 mb-3">💼</div>
                <h1 className="fw-bold display-3 mb-2">Job Tracker</h1>
                <hr className="border-secondary mx-auto" style={{ width: '80px' }} />
                <p className="text-secondary fs-5 mb-5">Track your applications with AI-powered insights</p>
                <div className="d-flex gap-3 justify-content-center">
                    <button className="btn btn-primary btn-lg px-5" onClick={() => navigate('/login')}>Login</button>
                    <button className="btn btn-outline-light btn-lg px-5" onClick={() => navigate('/register')}>Register</button>
                </div>
            </div>

            <hr className="border-secondary w-100" style={{ maxWidth: '700px' }} />

            <div className="row text-center mt-4" style={{ maxWidth: '700px' }}>
                <div className="col-md-4 mb-4">
                    <div className="fs-1 mb-2">📋</div>
                    <h6 className="fw-bold">Track</h6>
                    <p className="text-secondary small">Manage all your job applications in one place</p>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="fs-1 mb-2">🤖</div>
                    <h6 className="fw-bold">CV Match</h6>
                    <p className="text-secondary small">Match your CV to any job offer with AI</p>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="fs-1 mb-2">📊</div>
                    <h6 className="fw-bold">Insights</h6>
                    <p className="text-secondary small">Get AI feedback on your application progress</p>
                </div>
            </div>
        </div>
    )
}