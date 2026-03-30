import { blobRequest, formRequest, jsonRequest } from "./apiClient";
import { normalizeApplicationStatus } from "./applicationStatus";

const applicationsBasePath = "/api/job-applications";

export const getApplications = async (headers) => {
  const response = await jsonRequest(applicationsBasePath, { headers });
  return response.data || [];
};

export const updateApplicationStatus = async ({ applicationId, status, headers }) => {
  const response = await jsonRequest(`${applicationsBasePath}/${applicationId}/status`, {
    method: "PUT",
    headers,
    body: { status: normalizeApplicationStatus(status) },
  });

  return response.data;
};

export const submitJobApplication = async (formData) => {
  const response = await formRequest(applicationsBasePath, {
    method: "POST",
    body: formData,
  });

  return response.data;
};

export const downloadResume = async ({ applicationId, headers }) =>
  blobRequest(`${applicationsBasePath}/download/${applicationId}`, {
    headers,
  });
