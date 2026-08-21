import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MyProjects from './pages/MyProjects';
import Community from './pages/Community';
import Preview from './pages/Preview';
import Pricing from './pages/Pricing';
import Projects from './pages/Projects';
import View from './pages/View';
import Navbar from './components/Navbar';
import { Toaster } from "sonner";
import AuthPage from './pages/auth/AuthPage';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import Contact from './pages/Contact'


const App = () => {
  const { pathname } = useLocation()

  const hideNavbar = pathname.startsWith('/projects/') && pathname !== '/projects'
    || pathname.startsWith('/view/')
    || pathname.startsWith('/preview/')
  return (
    <div>
      <Toaster />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/community" element={<Community />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/view/:projectId" element={<View />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
        <Route path="/settings/account" element={<Settings />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/refund-policy' element={<RefundPolicy />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App