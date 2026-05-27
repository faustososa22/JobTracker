import { useNavigate } from "react-router-dom";

export function Navbar(){
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand app-navbar px-4">
            <span className="navbar-brand fw-bold d-flex align-items-center gap-2" style={{ color: '#1e293b', cursor: 'default' }}>
                <span className="auth-logo" style={{ width: '30px', height: '30px', fontSize: '15px', borderRadius: '8px' }}>J</span>
                Job Tracker
            </span>
            <div className="navbar-nav me-auto">
                <a className="nav-link fw-medium" href="/applications" style={{ color: '#64748b' }}>Applications</a>
                <a className="nav-link fw-medium" href="/cv-match" style={{ color: '#64748b' }}>CV Match</a>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    )
}
