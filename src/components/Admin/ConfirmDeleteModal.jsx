const ConfirmDeleteModal = ({
  title,
  description,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
  deleting,
}) => (
  <div className="modal-overlay">
    <div className="modal">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="modal-actions">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm} className="delete-btn" disabled={deleting}>
          {deleting ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;
