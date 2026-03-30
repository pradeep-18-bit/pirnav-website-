import {
  createJob,
  deleteJob,
  getJobById,
  listJobs,
  listPublicJobs,
  updateJob,
} from "../services/jobService.js";
import { sendSuccess } from "../utils/response.js";

export const getAdminJobs = async (_request, response) => {
  const jobs = await listJobs();
  sendSuccess(response, {
    statusCode: 200,
    message: "Jobs loaded.",
    data: jobs,
  });
};

export const getPublicJobs = async (_request, response) => {
  const jobs = await listPublicJobs();
  sendSuccess(response, {
    statusCode: 200,
    message: "Jobs loaded.",
    data: jobs,
  });
};

export const getPublicJob = async (request, response) => {
  const job = await getJobById(request.params.id);
  sendSuccess(response, {
    statusCode: 200,
    message: "Job loaded.",
    data: job,
  });
};

export const createJobRecord = async (request, response) => {
  const job = await createJob(request.body);
  sendSuccess(response, {
    statusCode: 201,
    message: "Job created.",
    data: job,
  });
};

export const updateJobRecord = async (request, response) => {
  const job = await updateJob(request.params.id, request.body);
  sendSuccess(response, {
    statusCode: 200,
    message: "Job updated.",
    data: job,
  });
};

export const deleteJobRecord = async (request, response) => {
  await deleteJob(request.params.id);
  sendSuccess(response, {
    statusCode: 200,
    message: "Job deleted.",
  });
};
