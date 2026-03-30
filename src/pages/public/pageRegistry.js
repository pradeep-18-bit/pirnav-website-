import { lazy } from "react";

export const DashboardPage = lazy(() => import("../../components/Dashboard/Dashboard.jsx"));
export const ContactPage = lazy(() => import("../../components/Dashboard/Contact.jsx"));
export const AboutPage = lazy(() => import("../../components/Dashboard/About.jsx"));
export const ProductsPage = lazy(() => import("../../components/Dashboard/Products.jsx"));
export const ProductDetailsPage = lazy(() => import("../../components/Dashboard/ProductDetails.jsx"));
export const ServicesPage = lazy(() => import("../../components/Services/OurServices.jsx"));
export const CareersPage = lazy(() => import("../../components/Dashboard/Careers.jsx"));
export const JobDetailsPage = lazy(() => import("../../components/Dashboard/JobDetails.jsx"));
export const WebDevelopmentPage = lazy(() => import("../../components/Services/WebPage.jsx"));
export const MobileDevelopmentPage = lazy(() => import("../../components/Services/MobilePage.jsx"));
export const MicrosoftSolutionsPage = lazy(() => import("../../components/Services/Microsoft.jsx"));
export const ApplicationDevelopmentPage = lazy(() =>
  import("../../components/Services/ApplicationDevelopment.jsx")
);
export const TestingAutomationPage = lazy(() =>
  import("../../components/Services/TestingAutomation.jsx")
);
export const MaintenanceSupportPage = lazy(() =>
  import("../../components/Services/MaintenanceSupport.jsx")
);
export const SapSolutionsPage = lazy(() => import("../../components/Services/SAP.jsx"));
export const OracleSolutionsPage = lazy(() => import("../../components/Services/Oracle.jsx"));
export const ProfessionalServicesPage = lazy(() =>
  import("../../components/Services/ProfessionalPage.jsx")
);
export const ServiceDetailPage = lazy(() =>
  import("../../components/Services/ServiceDetailPage.jsx")
);
