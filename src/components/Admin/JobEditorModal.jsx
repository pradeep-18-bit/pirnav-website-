const JobEditorModal = ({ editingJob, form, onChange, onCancel, onSave, saving }) => (
  <div className="modal-overlay">
    <div className="modal large">
      <h3>{editingJob ? "Edit Job" : "Post New Job"}</h3>

      <input
        placeholder="Job Title"
        value={form.jobTitle}
        onChange={(event) => onChange("jobTitle", event.target.value)}
      />

      <input
        placeholder="Work Location"
        value={form.workLocation}
        onChange={(event) => onChange("workLocation", event.target.value)}
      />

      <select value={form.jobType} onChange={(event) => onChange("jobType", event.target.value)}>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="hybrid">Hybrid</option>
        <option value="remote">Remote</option>
      </select>

      <select value={form.status} onChange={(event) => onChange("status", event.target.value)}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <input
        placeholder="Experience"
        value={form.experience}
        onChange={(event) => onChange("experience", event.target.value)}
      />

      <input
        placeholder="CTC"
        value={form.ctc}
        onChange={(event) => onChange("ctc", event.target.value)}
      />

      <input
        placeholder="Highest Qualification"
        value={form.highestQualification}
        onChange={(event) => onChange("highestQualification", event.target.value)}
      />

      <textarea
        placeholder="Job Description"
        value={form.jobDescription}
        onChange={(event) => onChange("jobDescription", event.target.value)}
      />

      <textarea
        placeholder="Mandatory Skills"
        value={form.mandatorySkills}
        onChange={(event) => onChange("mandatorySkills", event.target.value)}
      />

      <div className="modal-actions">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSave} className="save-btn" disabled={saving}>
          {saving ? "Saving..." : editingJob ? "Update" : "Create"}
        </button>
      </div>
    </div>
  </div>
);

export default JobEditorModal;
