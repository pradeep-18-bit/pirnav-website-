import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Dashboard/Footer.jsx";
import RequireAdminAuth from "./components/Admin/RequireAdminAuth.jsx";
import { AdminApplicationsProvider } from "./hooks/useAdminApplications.jsx";
import { useRouteUiEffects } from "./hooks/useRouteUiEffects.js";
import PageLoader from "./components/common/PageLoader.jsx";
import {
  AboutPage,
  ApplicationDevelopmentPage,
  CareersPage,
  ContactPage,
  DashboardPage,
  JobDetailsPage,
  MaintenanceSupportPage,
  MicrosoftSolutionsPage,
  MobileDevelopmentPage,
  OracleSolutionsPage,
  ProductDetailsPage,
  ProductsPage,
  ProfessionalServicesPage,
  SapSolutionsPage,
  ServiceDetailPage,
  ServicesPage,
  TestingAutomationPage,
  WebDevelopmentPage,
} from "./pages/public/pageRegistry.js";
import {
  AdminJobsPage,
  AdminLayoutPage,
  AdminLoginPage,
  ApplicationsPage,
  ContactMessagesPage,
  DashboardHomePage,
  InterviewsPage,
  PipelinePage,
  SelectedCandidatesPage,
} from "./pages/admin/pageRegistry.js";

const publicRoutes = [
  { path: "/", element: <DashboardPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/products/:id", element: <ProductDetailsPage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/careers", element: <CareersPage /> },
  { path: "/careers/:id", element: <JobDetailsPage /> },
  { path: "/services/application-development", element: <ApplicationDevelopmentPage /> },
  { path: "/services/testing-automation", element: <TestingAutomationPage /> },
  { path: "/services/maintainance-support", element: <MaintenanceSupportPage /> },
  { path: "/services/web-development", element: <WebDevelopmentPage /> },
  { path: "/services/mobile-app-development", element: <MobileDevelopmentPage /> },
  { path: "/services/sap-solutions", element: <SapSolutionsPage /> },
  { path: "/services/oracle-solutions", element: <OracleSolutionsPage /> },
  { path: "/services/microsoft-solutions", element: <MicrosoftSolutionsPage /> },
  { path: "/services/cybersecurity", element: <ServiceDetailPage slug="cybersecurity" /> },
  { path: "/services/ai-mlops", element: <ServiceDetailPage slug="ai-mlops" /> },
  { path: "/services/data-science", element: <ServiceDetailPage slug="data-science" /> },
  { path: "/services/professional-services", element: <ProfessionalServicesPage /> },
];

const adminChildRoutes = [
  { index: true, element: <DashboardHomePage /> },
  { path: "messages", element: <ContactMessagesPage /> },
  { path: "jobs", element: <AdminJobsPage /> },
  { path: "applications", element: <ApplicationsPage /> },
  { path: "pipeline", element: <PipelinePage /> },
  { path: "interviews", element: <InterviewsPage /> },
  { path: "selected-candidates", element: <SelectedCandidatesPage /> },
];

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  useRouteUiEffects(location);

  return (
    <div className="app-layout page-wrapper">
      {!hideLayout && <Navbar />}

      <main className={`main-content${hideLayout ? " main-content--flush" : ""}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdminAuth>
                  <AdminApplicationsProvider>
                    <AdminLayoutPage />
                  </AdminApplicationsProvider>
                </RequireAdminAuth>
              }
            >
              {adminChildRoutes.map((route) => (
                <Route
                  key={route.path || "index"}
                  index={route.index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
