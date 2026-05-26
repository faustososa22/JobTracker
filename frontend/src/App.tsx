import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { ApplicationDetailPage } from './pages/ApplicationDetailPage'
import { Navbar } from './components/Navbar'
import { CreateApplicationPage } from './pages/CreateApplicationPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CvMatchPage } from './pages/CvMatchPage'
import { EditApplicationPage } from './pages/EditApplicationPage'

function AppLayout() {
    const location = useLocation()
    const hideNavbar = ['/login', '/register'].includes(location.pathname)

    return <>
        {!hideNavbar && <Navbar />}
        <Routes>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/applications" element={<ProtectedRoute><ApplicationsPage/></ProtectedRoute>} />
            <Route path="/applications/create" element={<ProtectedRoute><CreateApplicationPage/></ProtectedRoute>} />
            <Route path='/applications/:id/edit' element={<ProtectedRoute><EditApplicationPage/></ProtectedRoute>}/>
            <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetailPage/></ProtectedRoute>} />
            <Route path="/cv-match" element={<ProtectedRoute><CvMatchPage/></ProtectedRoute>} />
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