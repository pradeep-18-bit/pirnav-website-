import { jsonRequest } from "./apiClient";

const interviewsBasePath = "/api/interviews";

export const DEFAULT_INTERVIEW_MANAGER_ID = (() => {
  const parsed = Number.parseInt(import.meta.env.VITE_DEFAULT_INTERVIEW_MANAGER_ID || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
})();

export const getInterviews = async (headers) => {
  const response = await jsonRequest(interviewsBasePath, { headers });
  return response.data || [];
};

export const updateInterview = async ({ interviewId, payload, headers }) => {
  const response = await jsonRequest(`${interviewsBasePath}/${interviewId}`, {
    method: "PUT",
    headers,
    body: payload,
  });

  return response.data;
};
