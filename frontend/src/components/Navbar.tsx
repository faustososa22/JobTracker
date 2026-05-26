import { useNavigate } from "react-router-dom";

export function Navbar(){
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand bg-dark navbar-dark px-4">
            <span className="navbar-brand fw-bold">Job Tracker</span>
            <div className="navbar-nav me-auto">
                <a className="nav-link" href="/applications">Applications</a>
                <a className="nav-link" href="/cv-match">CV Match</a>
            </div>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
            </button>
        </nav>
    )
}