import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  MessageSquare,
  Briefcase,
  Users,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import {
  applicationStatusLabels,
  normalizeApplicationStatus,
} from "../../services/applicationStatus";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "../../services/adminAuth";
import {
  getDashboardSummary,
  getRecentApplications,
  getRecentMessages,
} from "../../services/adminService";
import { getErrorMessage, isUnauthorizedError } from "../../services/apiClient";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    selectedCandidates: 0,
    messages: 0,
    jobs: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [error, setError] = useState("");

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  const getHeaders = useCallback(() => {
    const headers = getAdminHeaders(getAdminToken());

    if (!headers) {
      navigate("/admin-login", { replace: true });
      return null;
    }

    return headers;
  }, [navigate]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getHeaders();
      if (!headers) {
        return;
      }

      const [summary, messages, applications] = await Promise.all([
        getDashboardSummary(headers),
        getRecentMessages(headers),
        getRecentApplications(headers),
      ]);

      setStats({
        selectedCandidates: summary?.selectedCandidates ?? 0,
        messages: summary?.unreadMessages ?? 0,
        jobs: summary?.openPositions ?? 0,
        applications: summary?.pendingApplications ?? 0,
      });
      setRecentMessages(messages);
      setRecentApplications(applications);
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Unable to load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin-login", { replace: true });
      return;
    }

    loadDashboard();
  }, [loadDashboard, navigate]);

  const formatDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Summary of your admin panel activity</p>
      </div>

      {error && <div className="pipeline-feedback is-error">{error}</div>}

      <div className="stats-grid">
        <div
          className="stat-card selected-candidates-card"
          onClick={() => navigate("/admin/selected-candidates")}
        >
          <div className="stat-top">
            <p>Selected Candidates</p>
            <CheckCircle2 size={18} />
          </div>

          <h2>{loading ? "Loading..." : stats.selectedCandidates}</h2>
          <span className="stat-trend">Finalised hires</span>
        </div>

        <div
          className="stat-card messages-card"
          onClick={() => navigate("/admin/messages")}
        >
          <div className="stat-top">
            <p>Unread Messages</p>
            <MessageSquare size={18} />
          </div>

          <h2>{loading ? "Loading..." : stats.messages}</h2>
          <span className="stat-trend">New enquiries</span>
        </div>

        <div className="stat-card jobs-card" onClick={() => navigate("/admin/jobs")}>
          <div className="stat-top">
            <p>Open Positions</p>
            <Briefcase size={18} />
          </div>

          <h2>{loading ? "Loading..." : stats.jobs}</h2>
          <span className="stat-trend">Active jobs</span>
        </div>

        <div
          className="stat-card applications-card"
          onClick={() => navigate("/admin/pipeline")}
        >
          <div className="stat-top">
            <p>Pipeline Candidates</p>
            <Users size={18} />
          </div>

          <h2>{loading ? "Loading..." : stats.applications}</h2>
          <span className="stat-trend">Move candidates forward</span>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Messages</h3>
            <button onClick={() => navigate("/admin/messages")}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {recentMessages.length === 0 && <p>No recent messages</p>}

          {recentMessages.map((message) => (
            <div key={message.id} className="list-item">
              <div className="avatar">{message.name?.charAt(0)}</div>

              <div className="list-content">
                <strong>{message.name}</strong>
                <p>{message.subject}</p>
                <small>{message.message}</small>
              </div>

              <span className="date">
                <Clock size={12} /> {formatDate(message.createdDate)}
              </span>
            </div>
          ))}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Applications</h3>
            <button onClick={() => navigate("/admin/pipeline")}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          {recentApplications.length === 0 && <p>No recent applications</p>}

          {recentApplications.map((application) => {
            const normalizedStatus = normalizeApplicationStatus(application.status);

            return (
              <div key={application.id} className="list-item">
                <div className="avatar">{application.name?.charAt(0)}</div>

                <div className="list-content">
                  <strong>{application.name}</strong>
                  <p>{application.jobTitle || application.position}</p>
                </div>

                <span className={`status ${normalizedStatus}`}>
                  {applicationStatusLabels[normalizedStatus]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
