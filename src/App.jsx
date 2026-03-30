import { useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Contact from "./components/Dashboard/Contact.jsx";
import About from "./components/Dashboard/about.jsx";
import Products from "./components/Dashboard/Products.jsx";
import ProductDetails from "./components/Dashboard/ProductDetails.jsx";
import Footer from "./components/Dashboard/Footer.jsx";
import PublicServices from "./components/Services/OurServices.jsx";
import Careers from "./components/Dashboard/Careers.jsx";
import JobDetails from "./components/Dashboard/JobDetails.jsx";

// Admin Imports
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import RequireAdminAuth from "./components/Admin/RequireAdminAuth.jsx";
import { AdminApplicationsProvider } from "./components/Admin/applicationsContext.jsx";
import DashboardHome from "./components/Admin/DashboardHome.jsx";
import ContactMessages from "./components/Admin/ContactMessages.jsx";
import AdminJobs from "./components/Admin/AdminJobs.jsx";
import Applications from "./components/Admin/Applications.jsx";
import Interviews from "./components/Admin/Interviews.jsx";
import Pipeline from "./components/Admin/Pipeline.jsx";
import SelectedCandidates from "./components/Admin/SelectedCandidates.jsx";

//Sub pages
import WebPage from "./components/Services/WebPage.jsx";
import MobilePage from "./components/Services/MobilePage.jsx";
import Microsoft from "./components/Services/Microsoft.jsx";
import Application from "./components/Services/Applicationdevelopment.jsx";
import Testing from "./components/Services/Testing&Automation.jsx";
import Maintainance from "./components/Services/Maintainance&support.jsx";
import SAP from "./components/Services/SAP.jsx";
import Oracle from "./components/Services/Oracle.jsx";
import ProfessionalPage from "./components/Services/ProfessionalPage.jsx";
import ServiceDetailPage from "./components/Services/ServiceDetailPage.jsx";

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior });

      const scrollTargets = new Set([
        document.scrollingElement,
        document.documentElement,
        document.body,
      ]);

      document
        .querySelectorAll(
          "[data-scroll-container], .main-content, .page-shell, .site-content, .app-layout"
        )
        .forEach((element) => scrollTargets.add(element));

      document.querySelectorAll("body *").forEach((element) => {
        const style = window.getComputedStyle(element);
        const isScrollableY =
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          element.scrollHeight > element.clientHeight;

        if (isScrollableY) {
          scrollTargets.add(element);
        }
      });

      scrollTargets.forEach((element) => {
        if (!element) return;
        try {
          element.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } catch {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frameId);
  }, [location.key, location.pathname, location.search]);

  useEffect(() => {
    const selector = [
      ".reveal",
      ".stat-card",
      ".service-box",
      ".card",
      ".tile",
      ".executive-grid > div",
      ".story-card",
      ".career-card",
      ".job-card-modern",
      ".contact-card",
      ".contact-form-card",
      ".job-detail-card",
      ".service-outline-card",
      ".enterprise-service-card",
      ".homepage-why-item",
      ".feature-card",
      ".testimonial-card",
      ".service-card-modern",
      ".service-card-link",
      ".technology-card",
      ".enterprise-careers-panel",
      ".cta-panel",
      ".map-frame",
      ".hero-metric",
    ].join(", ");

    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => element.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("active"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="app-layout page-wrapper">
      {!hideLayout && <Navbar />}

      <main className={`main-content${hideLayout ? " main-content--flush" : ""}`}>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
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
          <Route path="/services/cybersecurity" element={<ServiceDetailPage slug="cybersecurity" />} />
          <Route path="/services/ai-mlops" element={<ServiceDetailPage slug="ai-mlops" />} />
          <Route path="/services/data-science" element={<ServiceDetailPage slug="data-science" />} />
          <Route path="/services/professional-services" element={<ProfessionalPage />} />

          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminApplicationsProvider>
                  <AdminLayout />
                </AdminApplicationsProvider>
              </RequireAdminAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="selected-candidates" element={<SelectedCandidates />} />
          </Route>

        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
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
