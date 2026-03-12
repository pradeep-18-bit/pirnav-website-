import { useState, useEffect } from "react";

import {

  Search,

  Eye,

  Clock,

  Bookmark,

  XCircle,

  CircleDot,

} from "lucide-react";

import "./Admin.css";
 
const API_BASE =

  "https://farrandly-interalar-talon.ngrok-free.dev/api/JobApplications";
 
const statusConfig = {

  pending: { label: "Pending", icon: Clock },

  reviewed: { label: "Reviewed", icon: CircleDot },

  shortlisted: { label: "Shortlisted", icon: Bookmark },

  rejected: { label: "Rejected", icon: XCircle },

};
 
const Applications = () => {

  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [selected, setSelected] = useState(null);
 
  const token = localStorage.getItem("adminToken");
 
  const headers = {

    Authorization: `Bearer ${token}`,

    "Content-Type": "application/json",

    "ngrok-skip-browser-warning": "true",

  };
 
  // ================================

  // FETCH APPLICATIONS

  // ================================

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const res = await fetch(API_BASE, { headers });
 
        if (res.status === 401) {

          console.error("Unauthorized. Login again.");

          return;

        }
 const data = await res.json();
 
// ensure we always have an array

const list = Array.isArray(data)

  ? data

  : data.applications || data.data || [];
 
const normalized = list.map((a) => ({

  id: a.id,

  name: a.name,

  email: a.email,

  jobTitle: a.jobTitle,

  status: a.status?.toLowerCase(),

  appliedDate: a.appliedDate,

}));
 
setApplications(normalized);
 
      } catch (err) {

        console.error("Fetch error:", err);

      }

    };
 
    if (token) {

      fetchApplications();

    }

  }, [token]);
 
  // ================================

  // SEARCH + FILTER

  // ================================

  const filtered = applications.filter((a) => {

    const matchSearch =

      a.name?.toLowerCase().includes(search.toLowerCase()) ||

      a.email?.toLowerCase().includes(search.toLowerCase()) ||

      a.jobTitle?.toLowerCase().includes(search.toLowerCase());
 
    const matchFilter = filter === "all" || a.status === filter;
 
    return matchSearch && matchFilter;

  });
 
  // ================================

  // UPDATE STATUS

  // ================================

  const updateStatus = async (id, status) => {

    try {

      const response = await fetch(`${API_BASE}/${id}/status`, {

        method: "PUT",

        headers,

        body: JSON.stringify({ status }),

      });
 
      if (!response.ok) throw new Error("Status update failed");
 
      setApplications((prev) =>

        prev.map((a) => (a.id === id ? { ...a, status } : a))

      );
 
      if (selected?.id === id) {

        setSelected({ ...selected, status });

      }

    } catch (error) {

      console.error("Update error:", error);

    }

  };
 
  // ================================

  // DOWNLOAD RESUME

  // ================================

  const downloadResume = async (id) => {

    try {

      const response = await fetch(`${API_BASE}/download/${id}`, {

        method: "GET",

        headers,

      });
 
      if (!response.ok) throw new Error("Download failed");
 
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
 
      const a = document.createElement("a");

      a.href = url;

      a.download = "resume.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();
 
      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error("Download error:", error);

    }

  };
 
  return (
<div className="applications-wrapper">
<div className="applications-header">
<h1>Applications</h1>
</div>
 
      {/* Summary Cards */}
<div className="summary-grid">

        {["pending", "reviewed", "shortlisted", "rejected"].map((status) => {

          const count = applications.filter((a) => a.status === status).length;

          const Icon = statusConfig[status].icon;
 
          return (
<div

              key={status}

              className={`summary-card ${filter === status ? "active" : ""}`}

              onClick={() => setFilter(filter === status ? "all" : status)}
>
<Icon size={18} />
<h2>{count}</h2>
<p>{statusConfig[status].label}</p>
</div>

          );

        })}
</div>
 
      {/* Filter + Search */}
<div className="filter-bar">
<select value={filter} onChange={(e) => setFilter(e.target.value)}>
<option value="all">All Status</option>
<option value="pending">Pending</option>
<option value="reviewed">Reviewed</option>
<option value="shortlisted">Shortlisted</option>
<option value="rejected">Rejected</option>
</select>
 
        <div className="search-box">
<Search size={14} />
<input

            placeholder="Search candidates..."

            value={search}

            onChange={(e) => setSearch(e.target.value)}

          />
</div>
</div>
 
      {/* Applications Table */}
<table className="applications-table">
<thead>
<tr>
<th>Candidate</th>
<th>Position</th>
<th>Status</th>
<th>Applied</th>
<th>Action</th>
</tr>
</thead>
 
        <tbody>

          {filtered.map((app) => (
<tr key={app.id}>
<td>
<strong>{app.name}</strong>
<br />
<small>{app.email}</small>
</td>
 
              <td>{app.jobTitle}</td>
 
              <td>
<span className={`status ${app.status}`}>

                  {statusConfig[app.status]?.label}
</span>
</td>
 
              <td>
<Clock size={12} />{" "}

                {new Date(app.appliedDate).toLocaleDateString()}
</td>
 
              <td>
<button onClick={() => setSelected(app)}>
<Eye size={14} />
</button>
</td>
</tr>

          ))}
</tbody>
</table>
 
      {/* Application Modal */}

      {selected && (
<div className="modal-overlay">
<div className="modal large">
<h3>Application Details</h3>
 
            <div className="candidate-info">
<h4>{selected.name}</h4>
<p>{selected.email}</p>
 
              <span className={`status ${selected.status}`}>

                {statusConfig[selected.status]?.label}
</span>
</div>
 
            <div className="details-box">
<p>
<strong>Position:</strong> {selected.jobTitle}
</p>
<p>
<strong>Applied:</strong>{" "}

                {new Date(selected.appliedDate).toLocaleDateString()}
</p>
</div>
 
            <button

              className="resume-btn"

              onClick={() => downloadResume(selected.id)}
>

              Download Resume
</button>
 
            <div className="status-actions">

              {["pending", "reviewed", "shortlisted", "rejected"].map(

                (status) => (
<button

                    key={status}

                    className={

                      selected.status === status ? "active-btn" : ""

                    }

                    onClick={() => updateStatus(selected.id, status)}
>

                    {statusConfig[status].label}
</button>

                )

              )}
</div>
 
            <div className="modal-actions">
<button onClick={() => setSelected(null)}>Close</button>
</div>
</div>
</div>

      )}
</div>

  );

};
 
export default Applications;