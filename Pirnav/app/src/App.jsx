import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import Contact from "./Components/Dashboard/Contact.jsx";
import About from "./Components/Dashboard/about.jsx";
import Footer from "./Components/Dashboard/Footer.jsx";
import PublicServices from "./Components/Services/OurServices.jsx";
import Careers from "./Components/Dashboard/Careers.jsx";
import JobDetails from "./Components/Dashboard/JobDetails.jsx";

// Admin Imports
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import AdminLogin from "./Components/Admin/AdminLogin.jsx";
import DashboardHome from "./Components/Admin/DashboardHome.jsx";
import Services from "./Components/Admin/Services.jsx";
import ContactMessages from "./Components/Admin/ContactMessages.jsx";
import AdminJobs from "./Components/Admin/AdminJobs.jsx";
import Applications from "./Components/Admin/Applications.jsx";

//Sub pages
import WebPage from "./Components/Services/WebPage.jsx";
import MobilePage from "./Components/Services/MobilePage.jsx";
import Microsoft from "./Components/Services/Microsoft.jsx";
import Application from "./Components/Services/Applicationdevelopment.jsx";
import Testing from "./Components/Services/Testing&Automation.jsx";
import Maintainance from "./Components/Services/Maintainance&support.jsx";
import SAP from "./Components/Services/SAP.jsx";
import Oracle from "./Components/Services/Oracle.jsx";
import ProfessionalPage from "./Components/Services/ProfessionalPage.jsx";

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>

        {/* Public */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<PublicServices />} />

        {/* Careers */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:id" element={<JobDetails />} />

        {/* Dropdown Service Routes */}
        <Route path="/services/application-development" element={<Application />} />
        <Route path="/services/testing-automation" element={<Testing />} />
        <Route path="/services/maintainance-support" element={<Maintainance />} />
        <Route path="/services/web-development" element={<WebPage />} />
        <Route path="/services/mobile-app-development" element={<MobilePage />} />
        <Route path="/services/sap-solutions" element={<SAP />} />
        <Route path="/services/oracle-solutions" element={<Oracle />} />
        <Route path="/services/microsoft-solutions" element={<Microsoft />} />
        <Route path="/services/professional-services" element={<ProfessionalPage />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="services" element={<Services />} />
          <Route path="messages" element={<ContactMessages />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="applications" element={<Applications />} />
        </Route>

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;