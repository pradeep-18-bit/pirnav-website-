import { useEffect, useState } from "react";

import {

  Wrench,

  MessageSquare,

  Briefcase,

  Users,

  TrendingUp,

  ArrowUpRight,

  Clock,

} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Admin.css";
 
const BASE_URL =

  "https://farrandly-interalar-talon.ngrok-free.dev/api/Admin";
 
const DashboardHome = () => {
 
  const navigate = useNavigate();
 
  // Dashboard statistics state

  const [stats, setStats] = useState({

    services: 0,

    messages: 0,

    jobs: 0,

    applications: 0,

  });
 
  // Loading state

  const [loading, setLoading] = useState(true);
 
  // Recent data

  const [recentMessages, setRecentMessages] = useState([]);

  const [recentApplications, setRecentApplications] = useState([]);
 
  // ---------------------------

  // AUTH HEADERS

  // ---------------------------
 
  const getHeaders = () => {
 
    const token = localStorage.getItem("adminToken");
 
    if (!token) {

      navigate("/admin-login");

      return {};

    }
 
    return {

      Authorization: `Bearer ${token}`,

      "Content-Type": "application/json",

      "ngrok-skip-browser-warning": "true",

    };

  };
 
  // ---------------------------

  // LOAD DASHBOARD DATA

  // ---------------------------
 
  useEffect(() => {

    fetchSummary();

    fetchRecentMessages();

    fetchRecentApplications();

  }, []);
 
  // ---------------------------

  // DASHBOARD SUMMARY

  // ---------------------------
 
  const fetchSummary = async () => {
 
    try {
 
      setLoading(true);
 
      const res = await fetch(`${BASE_URL}/dashboard-summary`, {

        headers: getHeaders(),

      });
 
      if (res.status === 401) {

        navigate("/admin-login");

        return;

      }
 
      if (!res.ok) {

        throw new Error("Failed to fetch dashboard summary");

      }
 
      const data = await res.json();
 
      console.log("Dashboard summary:", data);
 
      setStats({

        services: data.activeServices ?? 0,

        messages: data.unreadMessages ?? 0,

        jobs: data.openPositions ?? 0,

        applications: data.pendingReviews ?? 0,

      });
 
    } catch (err) {

      console.error("Dashboard summary error:", err);

    } finally {

      setLoading(false);

    }

  };
 
  // ---------------------------

  // RECENT MESSAGES

  // ---------------------------
 
  const fetchRecentMessages = async () => {
 
    try {
 
      const res = await fetch(`${BASE_URL}/recent-messages`, {

        headers: getHeaders(),

      });
 
      if (!res.ok) return;
 
      const data = await res.json();
 
      console.log("Recent messages:", data);
 
      setRecentMessages(Array.isArray(data) ? data : []);
 
    } catch (err) {

      console.error("Recent messages error:", err);

    }

  };
 
  // ---------------------------

  // RECENT APPLICATIONS

  // ---------------------------
 
  const fetchRecentApplications = async () => {
 
    try {
 
      const res = await fetch(`${BASE_URL}/recent-applications`, {

        headers: getHeaders(),

      });
 
      if (res.status === 401) {

        navigate("/admin-login");

        return;

      }
 
      if (!res.ok) return;
 
      const data = await res.json();
 
      console.log("Recent applications:", data);
 
      setRecentApplications(Array.isArray(data) ? data : []);
 
    } catch (err) {

      console.error("Recent applications error:", err);

    }

  };
 
  // ---------------------------

  // DATE FORMATTER

  // ---------------------------
 
  const formatDate = (date) => {

    if (!date) return "No Date";

    return new Date(date).toLocaleDateString();

  };
 
  // ---------------------------

  // UI

  // ---------------------------
 
  return (
<div className="dashboard-wrapper">
 
      {/* Header */}
 
      <div className="dashboard-header">
<h1>Dashboard</h1>
<p>Summary of your admin panel activity</p>
</div>
 
      {/* Top Cards */}
 
      <div className="stats-grid">
 
        <div

          className="stat-card services-card"

          onClick={() => navigate("/admin/services")}
>
<div className="stat-top">
<p>Active Services</p>
<Wrench size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.services}</h2>
 
          <span className="stat-trend">
<TrendingUp size={14} /> Active
</span>
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
 
          <span className="stat-trend">

            New enquiries
</span>
</div>
 
 
        <div

          className="stat-card jobs-card"

          onClick={() => navigate("/admin/jobs")}
>
<div className="stat-top">
<p>Open Positions</p>
<Briefcase size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.jobs}</h2>
 
          <span className="stat-trend">

            Active jobs
</span>
</div>
 
 
        <div

          className="stat-card applications-card"

          onClick={() => navigate("/admin/applications")}
>
<div className="stat-top">
<p>Pending Reviews</p>
<Users size={18} />
</div>
 
          <h2>{loading ? "Loading..." : stats.applications}</h2>
 
          <span className="stat-trend">

            Need review
</span>
</div>
 
      </div>
 
 
      {/* Bottom Section */}
 
      <div className="dashboard-bottom">
 
        {/* Recent Messages */}
 
        <div className="dashboard-card">
 
          <div className="card-header">
<h3>Recent Messages</h3>
 
            <button onClick={() => navigate("/admin/messages")}>

              View All <ArrowUpRight size={14} />
</button>
</div>
 
          {recentMessages.length === 0 && (
<p>No recent messages</p>

          )}
 
          {recentMessages.map((msg, index) => (
 
            <div key={index} className="list-item">
 
              <div className="avatar">

                {msg.name?.charAt(0)}
</div>
 
              <div className="list-content">
<strong>{msg.name}</strong>
<p>{msg.subject}</p>
<small>{msg.message}</small>
</div>
 
              <span className="date">
<Clock size={12} /> {formatDate(msg.date)}
</span>
 
            </div>
 
          ))}
 
        </div>
 
 
        {/* Recent Applications */}
 
        <div className="dashboard-card">
 
          <div className="card-header">
<h3>Recent Applications</h3>
 
            <button onClick={() => navigate("/admin/applications")}>

              View All <ArrowUpRight size={14} />
</button>
</div>
 
          {recentApplications.length === 0 && (
<p>No recent applications</p>

          )}
 
          {recentApplications.map((app, index) => (
 
            <div key={index} className="list-item">
 
              <div className="avatar">

                {app.name?.charAt(0)}
</div>
 
              <div className="list-content">
<strong>{app.name}</strong>
<p>{app.position}</p>
</div>
 
              <span className="status">

                {app.status}
</span>
 
            </div>
 
          ))}
 
        </div>
 
      </div>
 
    </div>

  );

};
 
export default DashboardHome;