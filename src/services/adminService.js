import { jsonRequest } from "./apiClient";

const adminBasePath = "/api/admin";

export const loginAdmin = async (credentials) => {
  const response = await jsonRequest(`${adminBasePath}/login`, {
    method: "POST",
    body: credentials,
  });

  return response.data;
};

export const getDashboardSummary = async (headers) => {
  const response = await jsonRequest(`${adminBasePath}/dashboard-summary`, { headers });
  return response.data;
};

export const getRecentMessages = async (headers) => {
  const response = await jsonRequest(`${adminBasePath}/recent-messages`, { headers });
  return response.data || [];
};

export const getRecentApplications = async (headers) => {
  const response = await jsonRequest(`${adminBasePath}/recent-applications`, { headers });
  return response.data || [];
};

export const shortlistCandidate = async ({ applicationId, nextSteps, headers }) => {
  const response = await jsonRequest(`${adminBasePath}/shortlist`, {
    method: "POST",
    headers,
    body: {
      applicationId,
      nextSteps,
    },
  });

  return response.data;
};

export const scheduleInterview = async ({ payload, headers }) => {
  const response = await jsonRequest(`${adminBasePath}/schedule-interview`, {
    method: "POST",
    headers,
    body: payload,
  });

  return response.data;
};
