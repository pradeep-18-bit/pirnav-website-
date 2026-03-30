import { lazy } from "react";

export const AdminLayoutPage = lazy(() => import("../../components/Admin/AdminLayout.jsx"));
export const AdminLoginPage = lazy(() => import("../../components/Admin/AdminLogin.jsx"));
export const DashboardHomePage = lazy(() => import("../../components/Admin/DashboardHome.jsx"));
export const ContactMessagesPage = lazy(() => import("../../components/Admin/ContactMessages.jsx"));
export const AdminJobsPage = lazy(() => import("../../components/Admin/AdminJobs.jsx"));
export const ApplicationsPage = lazy(() => import("../../components/Admin/Applications.jsx"));
export const InterviewsPage = lazy(() => import("../../components/Admin/Interviews.jsx"));
export const PipelinePage = lazy(() => import("../../components/Admin/Pipeline.jsx"));
export const SelectedCandidatesPage = lazy(() =>
  import("../../components/Admin/SelectedCandidates.jsx")
);
