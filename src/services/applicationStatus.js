export const applicationStatusLabels = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  selected: "Selected",
  rejected: "Rejected",
};

export const applicationStatusOptions = Object.keys(applicationStatusLabels);

export const normalizeApplicationStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return applicationStatusOptions.includes(normalized) ? normalized : "pending";
};

export const getApplicationSelectedDate = (application) =>
  application?.selectedDate ||
  application?.statusUpdatedAt ||
  application?.updatedAt ||
  application?.appliedDate ||
  "";
