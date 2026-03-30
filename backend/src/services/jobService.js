import crypto from "node:crypto";
import { readCollection, writeCollection } from "./dataStoreService.js";
import { AppError } from "../utils/AppError.js";

const normalizeJob = (job) => ({
  ...job,
  status: String(job.status || "open").toLowerCase() === "closed" ? "closed" : "open",
});

const sortJobs = (jobs) =>
  [...jobs].sort((jobA, jobB) => {
    const dateA = Date.parse(jobA.updatedAt || jobA.createdAt || 0) || 0;
    const dateB = Date.parse(jobB.updatedAt || jobB.createdAt || 0) || 0;
    return dateB - dateA;
  });

export const listJobs = async () => {
  const jobs = await readCollection("jobs");
  return sortJobs(jobs.map(normalizeJob));
};

export const listPublicJobs = async () => {
  const jobs = await listJobs();
  return jobs.filter((job) => job.status === "open");
};

export const getJobById = async (jobId) => {
  const jobs = await readCollection("jobs");
  const job = jobs.find((record) => String(record.id) === String(jobId));

  if (!job) {
    throw new AppError("Job not found.", 404);
  }

  return normalizeJob(job);
};

export const createJob = async (payload) => {
  const jobs = await readCollection("jobs");
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    ...payload,
    status: payload.status.toLowerCase(),
    createdAt: now,
    updatedAt: now,
  };

  await writeCollection("jobs", [...jobs, record]);
  return record;
};

export const updateJob = async (jobId, payload) => {
  const jobs = await readCollection("jobs");
  const index = jobs.findIndex((record) => String(record.id) === String(jobId));

  if (index === -1) {
    throw new AppError("Job not found.", 404);
  }

  const nextRecord = {
    ...jobs[index],
    ...payload,
    status: payload.status.toLowerCase(),
    updatedAt: new Date().toISOString(),
  };

  jobs[index] = nextRecord;
  await writeCollection("jobs", jobs);
  return normalizeJob(nextRecord);
};

export const deleteJob = async (jobId) => {
  const jobs = await readCollection("jobs");
  const nextJobs = jobs.filter((record) => String(record.id) !== String(jobId));

  if (nextJobs.length === jobs.length) {
    throw new AppError("Job not found.", 404);
  }

  await writeCollection("jobs", nextJobs);
};
