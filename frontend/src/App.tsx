import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ApplicationDetailPage } from './pages/ApplicationDetailPage'
import { Navbar } from './components/Navbar'
import { CreateApplicationPage } from './pages/CreateApplicationPage'

function AppLayout() {
    const location = useLocation()
    const hideNavbar = ['/login', '/register'].includes(location.pathname)

    return <>
        {!hideNavbar && <Navbar />}
        <Routes>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/applications" element={<ApplicationsPage/>} />
            <Route path="/applications/create" element={<CreateApplicationPage/>} />
            <Route path="/applications/:id" element={<ApplicationDetailPage/>} />
            <Route path="/" element={<div>Home</div>} />
        </Routes>
    </>
}

function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    )
}

export default App