import { useNavigate } from "react-router-dom";

export function Navbar(){
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand app-navbar px-4" style={{ height: '56px' }}>
            <span
                className="navbar-brand d-flex align-items-center gap-2"
                style={{ color: 'var(--text)', fontWeight: 600, fontSize: '15px', cursor: 'default', letterSpacing: '-0.01em' }}
            >
                <span className="auth-logo" style={{ width: '28px', height: '28px', fontSize: '13px', borderRadius: '7px', flexShrink: 0 }}>J</span>
                Job Tracker
            </span>
            <div className="navbar-nav me-auto ms-4">
                <a className="nav-link" href="/applications" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Applications</a>
                <a className="nav-link" href="/cv-match" style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>CV Match</a>
            </div>
            <button
                className="btn btn-sm"
                onClick={handleLogout}
                style={{ fontSize: '13px', color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}
            >
                Logout
            </button>
        </nav>
    )
}
