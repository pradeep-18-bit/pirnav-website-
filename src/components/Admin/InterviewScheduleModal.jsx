const InterviewScheduleModal = ({
  scheduleCandidate,
  scheduleForm,
  scheduleErrors,
  managerLabel,
  submitting,
  onChange,
  onClose,
  onSubmit,
}) => (
  <div className="modal-overlay interviews-modal-overlay">
    <div className="modal large interviews-modal">
      <h3>Schedule Interview</h3>
      <p className="interviews-modal-subtitle">
        {scheduleCandidate.candidateName} | {scheduleCandidate.jobTitle || "Interview"}
      </p>

      <form onSubmit={onSubmit} className="interviews-form-grid">
        <div className="interviews-field">
          <label htmlFor="schedule-date">Interview Date</label>
          <input
            id="schedule-date"
            type="date"
            value={scheduleForm.interviewDate}
            onChange={(event) => onChange("interviewDate", event.target.value)}
          />
          {scheduleErrors.interviewDate && (
            <small className="interviews-field-error">{scheduleErrors.interviewDate}</small>
          )}
        </div>

        <div className="interviews-field">
          <label htmlFor="schedule-time">Interview Time</label>
          <input
            id="schedule-time"
            type="time"
            value={scheduleForm.interviewTime}
            onChange={(event) => onChange("interviewTime", event.target.value)}
          />
          {scheduleErrors.interviewTime && (
            <small className="interviews-field-error">{scheduleErrors.interviewTime}</small>
          )}
        </div>

        <div className="interviews-field">
          <label htmlFor="schedule-mode">Mode</label>
          <select
            id="schedule-mode"
            value={scheduleForm.mode}
            onChange={(event) => onChange("mode", event.target.value)}
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="interviews-field">
          <label htmlFor="schedule-manager">Manager</label>
          <input id="schedule-manager" type="text" value={managerLabel} disabled />
        </div>

        <div className="interviews-field interviews-field-full">
          <label htmlFor="schedule-link">Meeting Link</label>
          <input
            id="schedule-link"
            type="url"
            value={scheduleForm.meetingLink}
            onChange={(event) => onChange("meetingLink", event.target.value)}
            placeholder={
              scheduleForm.mode === "Online"
                ? "https://meet.example.com/..."
                : "Optional for offline interviews"
            }
          />
          {scheduleErrors.meetingLink && (
            <small className="interviews-field-error">{scheduleErrors.meetingLink}</small>
          )}
        </div>

        <div className="interviews-field interviews-field-full">
          <label htmlFor="schedule-notes">Instructions</label>
          <textarea
            id="schedule-notes"
            rows="4"
            value={scheduleForm.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="Optional instructions for the candidate or panel"
          />
        </div>

        <div className="modal-actions interviews-modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={submitting}>
            {submitting ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default InterviewScheduleModal;
