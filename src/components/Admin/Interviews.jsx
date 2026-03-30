import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "../../services/adminAuth";
import {
  getApplicationSelectedDate,
  normalizeApplicationStatus,
} from "../../services/applicationStatus";
import { useAdminApplications } from "../../hooks/useAdminApplications";
import {
  DEFAULT_INTERVIEW_MANAGER_ID,
  getInterviews,
  updateInterview,
} from "../../services/interviewsService";
import { getErrorMessage, isUnauthorizedError } from "../../services/apiClient";
import InterviewScheduleModal from "./InterviewScheduleModal";

const interviewStatusConfig = {
  scheduled: { label: "Scheduled", tone: "scheduled" },
  completed: { label: "Completed", tone: "completed" },
  cancelled: { label: "Cancelled", tone: "cancelled" },
};

const interviewStatusOptions = Object.keys(interviewStatusConfig);

const createEmptyScheduleForm = () => ({
  interviewDate: "",
  interviewTime: "",
  mode: "Online",
  meetingLink: "",
  notes: "",
});

const getScheduleFormFromCandidate = (candidate) => ({
  interviewDate: candidate?.interviewDate || "",
  interviewTime: candidate?.interviewTime || "",
  mode: normalizeInterviewMode(candidate?.mode),
  meetingLink: candidate?.meetingLink || "",
  notes: candidate?.notes || "",
});

const normalizeInterviewStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return interviewStatusOptions.includes(normalized) ? normalized : "scheduled";
};

const normalizeInterviewMode = (mode) =>
  String(mode || "").toLowerCase() === "offline" ? "Offline" : "Online";

const formatDateForInput = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
};

const formatTimeForInput = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && /[t\s]/i.test(String(value))) {
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
  }

  const [hours = "00", minutes = "00"] = String(value).split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const formatDateForApi = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return String(value);
};

const formatDateTime = (date, time) => {
  if (!date && !time) return "Not scheduled";

  const composed = date && time ? new Date(`${date}T${time}`) : new Date(date);
  if (Number.isNaN(composed.getTime())) {
    return [date, time].filter(Boolean).join(" ");
  }

  return composed.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: time ? "short" : undefined,
  });
};

const normalizeInterview = (interview) => ({
  id: interview.id,
  applicationId: interview.applicationId || null,
  candidateName: interview.candidateName || "Unknown candidate",
  email: interview.email || "",
  jobTitle: interview.jobTitle || "",
  interviewDate: formatDateForInput(interview.interviewDate),
  interviewTime: formatTimeForInput(interview.interviewTime),
  mode: normalizeInterviewMode(interview.mode),
  status: normalizeInterviewStatus(interview.status),
  managerId: interview.managerId || DEFAULT_INTERVIEW_MANAGER_ID,
  managerName: interview.managerName || `Manager #${interview.managerId || DEFAULT_INTERVIEW_MANAGER_ID}`,
  meetingLink: interview.meetingLink || "",
  notes: interview.instructions || interview.notes || "",
  applicationStatus: normalizeApplicationStatus(interview.applicationStatus),
  selectedDate: getApplicationSelectedDate(interview),
  isScheduled: true,
});

const createShortlistedCandidateRow = (application) => ({
  id: `application-${application.id}`,
  applicationId: application.id,
  candidateName: application.name || "Unknown candidate",
  email: application.email || "",
  jobTitle: application.jobTitle || "Not assigned",
  interviewDate: "",
  interviewTime: "",
  mode: "Online",
  status: "scheduled",
  managerId: DEFAULT_INTERVIEW_MANAGER_ID,
  managerName: "",
  meetingLink: "",
  notes: "",
  applicationStatus: normalizeApplicationStatus(application.status),
  selectedDate: getApplicationSelectedDate(application),
  isScheduled: false,
});

const Interviews = () => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const {
    applications,
    loading: applicationsLoading,
    scheduleInterview,
    updateApplicationStatus,
  } = useAdminApplications();
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [selectionUpdatingId, setSelectionUpdatingId] = useState(null);
  const [rejectUpdatingId, setRejectUpdatingId] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(createEmptyScheduleForm());
  const [scheduleErrors, setScheduleErrors] = useState({});
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
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

  const fetchInterviewList = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      if (!headers) return;

      const list = await getInterviews(headers);
      setInterviews(list.map(normalizeInterview));
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setFeedback({
        type: "error",
        text: getErrorMessage(requestError, "Unable to load interviews."),
      });
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    fetchInterviewList();
  }, [fetchInterviewList, navigate, token]);

  const applicationById = useMemo(
    () => new Map(applications.map((application) => [String(application.id), application])),
    [applications]
  );

  const mergedInterviews = useMemo(
    () =>
      interviews.map((interview) => {
        const application = applicationById.get(String(interview.applicationId));

        if (!application) {
          return interview;
        }

        return {
          ...interview,
          candidateName: application.name || interview.candidateName,
          email: application.email || interview.email,
          jobTitle: application.jobTitle || interview.jobTitle,
          applicationStatus: normalizeApplicationStatus(application.status),
          selectedDate: application.selectedDate || interview.selectedDate,
        };
      }),
    [applicationById, interviews]
  );

  const scheduledApplicationIds = useMemo(
    () =>
      new Set(
        mergedInterviews
          .map((interview) => String(interview.applicationId || ""))
          .filter(Boolean)
      ),
    [mergedInterviews]
  );

  const shortlistedCandidates = useMemo(
    () =>
      applications.filter(
        (application) => normalizeApplicationStatus(application.status) === "shortlisted"
      ),
    [applications]
  );

  const interviewRows = useMemo(() => {
    const unscheduledCandidates = shortlistedCandidates
      .filter((application) => !scheduledApplicationIds.has(String(application.id)))
      .map(createShortlistedCandidateRow);

    return [...unscheduledCandidates, ...mergedInterviews].filter(
      (interview) => interview.applicationStatus !== "rejected"
    );
  }, [mergedInterviews, scheduledApplicationIds, shortlistedCandidates]);

  const filteredInterviews = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return interviewRows.filter((interview) => {
      const matchesSearch =
        !query ||
        interview.candidateName.toLowerCase().includes(query) ||
        interview.email.toLowerCase().includes(query) ||
        interview.jobTitle.toLowerCase().includes(query) ||
        interview.managerName.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || (interview.isScheduled && interview.status === filter);

      return matchesSearch && matchesFilter;
    });
  }, [deferredSearch, filter, interviewRows]);

  const handleMarkSelected = async (interview) => {
    if (!interview?.applicationId) {
      setFeedback({
        type: "error",
        text: "This interview is not linked to an application record.",
      });
      return;
    }

    if (!interview.isScheduled) {
      setFeedback({
        type: "error",
        text: "Schedule the interview before moving the candidate to Selected.",
      });
      return;
    }

    try {
      setSelectionUpdatingId(interview.id);
      setFeedback({ type: "", text: "" });

      const result = await updateApplicationStatus(interview.applicationId, "selected");

      if (!result.ok) {
        throw new Error(result.message || "Unable to mark candidate as selected.");
      }

      setFeedback({
        type: "success",
        text: "Candidate moved to Selected Candidates successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text: getErrorMessage(error, "Unable to mark candidate as selected."),
      });
    } finally {
      setSelectionUpdatingId(null);
    }
  };

  const handleRejectCandidate = async (interview) => {
    if (!interview?.applicationId) {
      setFeedback({
        type: "error",
        text: "This interview is not linked to an application record.",
      });
      return;
    }

    try {
      setRejectUpdatingId(interview.applicationId);
      setFeedback({ type: "", text: "" });

      const result = await updateApplicationStatus(interview.applicationId, "rejected");

      if (!result.ok) {
        throw new Error(result.message || "Unable to reject candidate.");
      }

      setFeedback({
        type: "success",
        text: `${interview.candidateName} rejected successfully.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text: getErrorMessage(error, "Unable to reject candidate."),
      });
    } finally {
      setRejectUpdatingId(null);
    }
  };

  const openScheduleModal = (candidate) => {
    setScheduleCandidate(candidate);
    setScheduleForm(getScheduleFormFromCandidate(candidate));
    setScheduleErrors({});
    setFeedback({ type: "", text: "" });
    setScheduleOpen(true);
  };

  const closeScheduleModal = () => {
    setScheduleOpen(false);
    setScheduleCandidate(null);
    setScheduleForm(createEmptyScheduleForm());
    setScheduleErrors({});
  };

  const handleScheduleFieldChange = (field, value) => {
    setScheduleForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "mode" && value === "Offline") {
        next.meetingLink = "";
      }

      return next;
    });

    setScheduleErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateScheduleForm = () => {
    const nextErrors = {};

    if (!scheduleForm.interviewDate) {
      nextErrors.interviewDate = "Interview date is required.";
    }

    if (!scheduleForm.interviewTime) {
      nextErrors.interviewTime = "Interview time is required.";
    }

    if (scheduleForm.mode === "Online" && !scheduleForm.meetingLink.trim()) {
      nextErrors.meetingLink = "Meeting link is required for online interviews.";
    }

    setScheduleErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();

    if (!scheduleCandidate?.applicationId || !validateScheduleForm()) {
      return;
    }

    try {
      setScheduleSubmitting(true);
      setFeedback({ type: "", text: "" });

      if (scheduleCandidate.isScheduled && scheduleCandidate.id) {
        const headers = getHeaders();
        if (!headers) return;

        await updateInterview({
          interviewId: scheduleCandidate.id,
          headers,
          payload: {
            interviewDate: formatDateForApi(scheduleForm.interviewDate),
            interviewTime: `${scheduleForm.interviewTime}:00`,
            mode: scheduleForm.mode,
            meetingLink:
              scheduleForm.mode === "Online" ? scheduleForm.meetingLink.trim() : "",
            instructions: scheduleForm.notes.trim(),
            notes: scheduleForm.notes.trim(),
            managerId: String(DEFAULT_INTERVIEW_MANAGER_ID),
            status: scheduleCandidate.status || "scheduled",
          },
        });
      } else {
        const result = await scheduleInterview({
          applicationId: scheduleCandidate.applicationId,
          interviewForm: {
            date: scheduleForm.interviewDate,
            time: scheduleForm.interviewTime,
            mode: scheduleForm.mode,
            meetingLink: scheduleForm.meetingLink,
            notes: scheduleForm.notes,
          },
        });

        if (!result.ok) {
          throw new Error(result.message || "Unable to schedule interview.");
        }
      }

      await fetchInterviewList();
      setFeedback({
        type: "success",
        text: `${scheduleCandidate.candidateName} scheduled successfully.`,
      });
      closeScheduleModal();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
        return;
      }

      setFeedback({
        type: "error",
        text: getErrorMessage(error, "Unable to schedule interview."),
      });
    } finally {
      setScheduleSubmitting(false);
    }
  };

  const isPageLoading = loading || applicationsLoading;

  return (
    <div className="interviews-wrapper">
      <div className="interviews-header">
        <div>
          <h1>Interviews</h1>
          <p>Schedule shortlisted candidates here and manage interview outcomes in one place.</p>
        </div>
      </div>

      <div className="interviews-toolbar">
        <div className="search-box interviews-search">
          <Search size={14} />
          <input
            placeholder="Search by candidate, email, job title, or manager..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="interviews-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          {interviewStatusOptions.map((status) => (
            <option key={status} value={status}>
              {interviewStatusConfig[status].label}
            </option>
          ))}
        </select>
      </div>

      {feedback.text && (
        <div className={`interviews-feedback ${feedback.type === "error" ? "is-error" : "is-success"}`}>
          {feedback.text}
        </div>
      )}

      <div className="interviews-table-shell">
        <table className="interviews-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job Title</th>
              <th>Interview</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isPageLoading ? (
              <tr>
                <td colSpan={7} className="interviews-empty">
                  Loading interviews...
                </td>
              </tr>
            ) : filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="interviews-empty">
                  No shortlisted candidates or interviews found.
                </td>
              </tr>
            ) : (
              filteredInterviews.map((interview) => (
                <tr key={interview.id}>
                  <td>
                    <div className="interview-candidate">
                      <strong>{interview.candidateName}</strong>
                      <small>{interview.email}</small>
                      {interview.applicationStatus === "selected" && (
                        <span className="interview-selected-pill">Selected Candidate</span>
                      )}
                    </div>
                  </td>
                  <td>{interview.jobTitle || "Not assigned"}</td>
                  <td>
                    <div className="interview-datetime">
                      <CalendarDays size={14} />
                      <span>
                        {interview.isScheduled
                          ? formatDateTime(interview.interviewDate, interview.interviewTime)
                          : "Not scheduled yet"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {interview.isScheduled ? (
                      <span className={`interview-mode-badge ${interview.mode.toLowerCase()}`}>
                        {interview.mode}
                      </span>
                    ) : (
                      <span className="interviews-empty-inline">--</span>
                    )}
                  </td>
                  <td>
                    {interview.isScheduled ? (
                      <span
                        className={`interview-status-badge ${interviewStatusConfig[interview.status].tone}`}
                      >
                        {interviewStatusConfig[interview.status].label}
                      </span>
                    ) : (
                      <span className="interview-status-badge awaiting">Awaiting Schedule</span>
                    )}
                  </td>
                  <td>{interview.managerName || "Not assigned"}</td>
                  <td>
                    <div className="interview-actions">
                      <button
                        type="button"
                        className="interview-row-btn btn-primary"
                        onClick={() => openScheduleModal(interview)}
                        disabled={
                          scheduleSubmitting &&
                          scheduleCandidate?.applicationId === interview.applicationId
                        }
                      >
                        {scheduleSubmitting &&
                        scheduleCandidate?.applicationId === interview.applicationId
                          ? "Scheduling..."
                          : "Schedule"}
                      </button>

                      <button
                        type="button"
                        className="interview-row-btn interview-row-btn-success"
                        onClick={() => handleMarkSelected(interview)}
                        disabled={
                          !interview.applicationId ||
                          !interview.isScheduled ||
                          selectionUpdatingId === interview.id ||
                          interview.applicationStatus === "selected"
                        }
                      >
                        {interview.applicationStatus === "selected"
                          ? "Selected"
                          : selectionUpdatingId === interview.id
                            ? "Saving..."
                            : "Mark Selected"}
                      </button>

                      <button
                        type="button"
                        className="interview-row-btn interview-row-btn-danger"
                        onClick={() => handleRejectCandidate(interview)}
                        disabled={
                          !interview.applicationId ||
                          rejectUpdatingId === interview.applicationId ||
                          interview.applicationStatus === "selected" ||
                          interview.applicationStatus === "rejected"
                        }
                      >
                        {rejectUpdatingId === interview.applicationId ? "Saving..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {scheduleOpen && scheduleCandidate && (
        <InterviewScheduleModal
          scheduleCandidate={scheduleCandidate}
          scheduleForm={scheduleForm}
          scheduleErrors={scheduleErrors}
          managerLabel={`Manager #${DEFAULT_INTERVIEW_MANAGER_ID}`}
          submitting={scheduleSubmitting}
          onChange={handleScheduleFieldChange}
          onClose={closeScheduleModal}
          onSubmit={handleScheduleSubmit}
        />
      )}
    </div>
  );
};

export default Interviews;
