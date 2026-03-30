import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "../../services/adminAuth";
import { getErrorMessage, isUnauthorizedError } from "../../services/apiClient";
import {
  createJob,
  deleteJob,
  getAdminJobs,
  updateJob,
} from "../../services/jobsService";
import JobEditorModal from "./JobEditorModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const initialForm = {
  jobTitle: "",
  workLocation: "",
  jobType: "full-time",
  status: "open",
  experience: "",
  ctc: "",
  highestQualification: "",
  jobDescription: "",
  mandatorySkills: "",
};

const AdminJobs = () => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const deferredSearch = useDeferredValue(search);

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  const getHeaders = useCallback(() => {
    const headers = getAdminHeaders(token);

    if (!headers) {
      navigate("/admin-login", { replace: true });
      return null;
    }

    return headers;
  }, [navigate, token]);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const headers = getHeaders();
      if (!headers) return;

      const data = await getAdminJobs(headers);
      setJobs(data);
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Failed to fetch jobs."));
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchJobs();
  }, [fetchJobs, navigate, token]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const headers = getHeaders();
      if (!headers) return;

      if (editingJob) {
        await updateJob({
          jobId: editingJob.id,
          job: form,
          headers,
        });
      } else {
        await createJob({
          job: form,
          headers,
        });
      }

      setShowModal(false);
      setEditingJob(null);
      setForm(initialForm);
      await fetchJobs();
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Operation failed."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingJob) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      const headers = getHeaders();
      if (!headers) return;

      await deleteJob({
        jobId: editingJob.id,
        headers,
      });

      setDeleteModal(false);
      setEditingJob(null);
      await fetchJobs();
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Delete failed."));
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      jobTitle: job.jobTitle || "",
      workLocation: job.workLocation || "",
      jobType: job.jobType || "full-time",
      status: job.status || "open",
      experience: job.experience || "",
      ctc: job.ctc || "",
      highestQualification: job.highestQualification || "",
      jobDescription: job.jobDescription || "",
      mandatorySkills: job.mandatorySkills || "",
    });
    setShowModal(true);
  };

  const filteredJobs = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) =>
      [job.jobTitle, job.workLocation, job.mandatorySkills, job.jobDescription]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [deferredSearch, jobs]);

  return (
    <div className="jobs-wrapper">
      <div className="jobs-header">
        <h1>Jobs</h1>
        <button className="add-btn" onClick={openCreate}>
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          placeholder="Search jobs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <div className="pipeline-feedback is-error">{error}</div>}
      {loading && <p>Loading...</p>}

      <div className="jobs-accordion">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card-admin">
            <div className="job-header-admin">
              <div>
                <h3>{job.jobTitle}</h3>
                <p>
                  {job.workLocation} | {job.jobType} | Experience: {job.experience}
                </p>
              </div>

              <div className="job-actions-admin">
                <button
                  className="expand-btn"
                  onClick={() => setOpenId(openId === job.id ? null : job.id)}
                >
                  {openId === job.id ? "-" : "+"}
                </button>

                <button onClick={() => openEdit(job)}>
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => {
                    setEditingJob(job);
                    setDeleteModal(true);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className={`job-expand-section ${openId === job.id ? "active" : ""}`}>
              <div className="expand-content">
                <p>
                  <strong>CTC:</strong> {job.ctc}
                </p>
                <p>
                  <strong>Status:</strong> {job.status}
                </p>
                <p>
                  <strong>Highest Qualification:</strong> {job.highestQualification}
                </p>

                <h4>Job Description</h4>
                <p>{job.jobDescription}</p>

                <h4>Mandatory Skills</h4>
                <pre>{job.mandatorySkills}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <JobEditorModal
          editingJob={editingJob}
          form={form}
          onChange={handleFormChange}
          onCancel={() => setShowModal(false)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteModal && editingJob && (
        <ConfirmDeleteModal
          title="Delete Job"
          description={`Are you sure you want to delete ${editingJob.jobTitle}?`}
          onCancel={() => setDeleteModal(false)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default AdminJobs;
