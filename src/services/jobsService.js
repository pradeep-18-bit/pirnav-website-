import { jsonRequest } from "./apiClient";

const jobsBasePath = "/api/jobs";

export const getPublicJobs = async () => {
  const response = await jsonRequest(`${jobsBasePath}/public`);
  return response.data || [];
};

export const getPublicJobById = async (jobId) => {
  const response = await jsonRequest(`${jobsBasePath}/public/${jobId}`);
  return response.data;
};

export const getAdminJobs = async (headers) => {
  const response = await jsonRequest(jobsBasePath, { headers });
  return response.data || [];
};

export const createJob = async ({ job, headers }) => {
  const response = await jsonRequest(jobsBasePath, {
    method: "POST",
    headers,
    body: job,
  });

  return response.data;
};

export const updateJob = async ({ jobId, job, headers }) => {
  const response = await jsonRequest(`${jobsBasePath}/${jobId}`, {
    method: "PUT",
    headers,
    body: job,
  });

  return response.data;
};

export const deleteJob = async ({ jobId, headers }) => {
  await jsonRequest(`${jobsBasePath}/${jobId}`, {
    method: "DELETE",
    headers,
  });
};
