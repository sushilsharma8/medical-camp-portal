import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Camps from './pages/Camps.jsx'
import CampDetails from './pages/CampDetails.jsx'
import Register from './pages/Register.jsx'
import RegistrationSuccess from './pages/RegistrationSuccess.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/camps/:id" element={<CampDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/success" element={<RegistrationSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
