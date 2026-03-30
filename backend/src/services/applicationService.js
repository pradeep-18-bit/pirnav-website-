import path from "node:path";
import crypto from "node:crypto";
import { readCollection, writeCollection } from "./dataStoreService.js";
import { sendShortlistedEmail } from "./emailService.js";
import { AppError } from "../utils/AppError.js";
import { jobApplicationSchema } from "../utils/schemas.js";

const DEFAULT_SHORTLIST_NEXT_STEPS =
  "Our hiring team will contact you shortly with interview details and the next stage of the process.";

const applicationStatuses = new Set(["pending", "shortlisted", "selected", "rejected"]);

const normalizeStatus = (value) => {
  const normalized = String(value || "pending").toLowerCase();
  return applicationStatuses.has(normalized) ? normalized : "pending";
};

const normalizeDateOnly = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
};

const sanitizeApplication = (application) => ({
  ...application,
  status: normalizeStatus(application.status),
  resumePath: undefined,
  resumeStoredName: undefined,
});

const getApplicationsWithRelations = (applications, jobs, interviews) =>
  applications
    .map((application) => {
      const job = jobs.find((jobRecord) => String(jobRecord.id) === String(application.jobId));
      const interview = interviews.find(
        (interviewRecord) => String(interviewRecord.applicationId) === String(application.id)
      );

      return sanitizeApplication({
        ...application,
        jobTitle: application.jobTitle || job?.jobTitle || "Not assigned",
        position: application.jobTitle || job?.jobTitle || "Not assigned",
        interviewScheduled: Boolean(interview),
        interview:
          interview && {
            ...interview,
            interviewDate: normalizeDateOnly(interview.interviewDate),
          },
      });
    })
    .sort((applicationA, applicationB) => {
      const dateA = Date.parse(applicationA.updatedAt || applicationA.appliedDate || 0) || 0;
      const dateB = Date.parse(applicationB.updatedAt || applicationB.appliedDate || 0) || 0;
      return dateB - dateA;
    });

const getApplicationById = (applications, applicationId) =>
  applications.find((record) => String(record.id) === String(applicationId));

const assertApplicationExists = (applications, applicationId) => {
  const application = getApplicationById(applications, applicationId);

  if (!application) {
    throw new AppError("Application not found.", 404);
  }

  return application;
};

const mapApplicationForm = (fields, resumeFile, job) => {
  const name = fields.Name || fields.name || "";
  const email = fields.Email || fields.email || "";

  return {
    id: crypto.randomUUID(),
    jobId: fields.JobId || fields.jobId || "",
    jobTitle: job.jobTitle,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phoneNumber: String(fields.PhoneNumber || fields.phoneNumber || fields.phone || "").trim(),
    dateOfBirth: String(fields.DateOfBirth || fields.dateOfBirth || fields.dob || "").trim(),
    gender: String(fields.Gender || fields.gender || "").trim(),
    highestQualification: String(
      fields.HighestQualification || fields.highestQualification || fields.qualification || ""
    ).trim(),
    totalExperience: String(
      fields.TotalExperience || fields.totalExperience || fields.experience || ""
    ).trim(),
    currentCompany: String(fields.CurrentCompany || fields.currentCompany || "").trim(),
    currentCTC: String(fields.CurrentCTC || fields.currentCTC || "").trim(),
    expectedCTC: String(fields.ExpectedCTC || fields.expectedCTC || "").trim(),
    noticePeriod: String(fields.NoticePeriod || fields.noticePeriod || "").trim(),
    currentLocation: String(
      fields.CurrentLocation || fields.currentLocation || fields.location || ""
    ).trim(),
    linkedInUrl: String(fields.LinkedInUrl || fields.linkedInUrl || fields.linkedin || "").trim(),
    resumeOriginalName: resumeFile.originalname,
    resumeStoredName: resumeFile.filename,
    resumePath: resumeFile.path,
    status: "pending",
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    selectedDate: "",
  };
};

export const listApplications = async () => {
  const [applications, jobs, interviews] = await Promise.all([
    readCollection("applications"),
    readCollection("jobs"),
    readCollection("interviews"),
  ]);

  return getApplicationsWithRelations(applications, jobs, interviews);
};

export const getRecentApplications = async (limit = 4) => {
  const applications = await listApplications();
  return applications.slice(0, limit);
};

export const submitApplication = async ({ fields, resumeFile }) => {
  if (!resumeFile) {
    throw new AppError("Resume upload is required.", 400);
  }

  const [jobs, applications] = await Promise.all([
    readCollection("jobs"),
    readCollection("applications"),
  ]);
  const jobId = fields.JobId || fields.jobId;
  const job = jobs.find((record) => String(record.id) === String(jobId));

  if (!job) {
    throw new AppError("Selected job does not exist.", 404);
  }

  if (String(job.status).toLowerCase() !== "open") {
    throw new AppError("This job is no longer accepting applications.", 400);
  }

  const record = mapApplicationForm(fields, resumeFile, job);
  const validation = jobApplicationSchema.safeParse(record);

  if (!validation.success) {
    const errors = validation.error.issues.reduce((accumulator, issue) => {
      const pathKey = issue.path.join(".") || "root";
      accumulator[pathKey] = issue.message;
      return accumulator;
    }, {});
    throw new AppError("Validation failed.", 400, errors);
  }

  await writeCollection("applications", [...applications, record]);
  return sanitizeApplication(record);
};

export const updateApplicationStatus = async ({ applicationId, status }) => {
  const applications = await readCollection("applications");
  const application = assertApplicationExists(applications, applicationId);
  const normalizedStatus = normalizeStatus(status);
  const now = new Date().toISOString();

  application.status = normalizedStatus;
  application.updatedAt = now;
  application.selectedDate = normalizedStatus === "selected" ? now : "";

  await writeCollection("applications", applications);
  return sanitizeApplication(application);
};

export const shortlistApplication = async ({ applicationId, nextSteps }) => {
  const applications = await readCollection("applications");
  const application = assertApplicationExists(applications, applicationId);
  const resolvedNextSteps = String(nextSteps || "").trim() || DEFAULT_SHORTLIST_NEXT_STEPS;

  application.status = "shortlisted";
  application.updatedAt = new Date().toISOString();
  application.selectedDate = "";

  await writeCollection("applications", applications);

  await sendShortlistedEmail({
    candidateName: application.name,
    candidateEmail: application.email,
    nextSteps: resolvedNextSteps,
  });

  return sanitizeApplication(application);
};

export const getApplicationResume = async (applicationId) => {
  const applications = await readCollection("applications");
  const application = assertApplicationExists(applications, applicationId);

  if (!application.resumePath || !application.resumeStoredName) {
    throw new AppError("Resume file was not found for this application.", 404);
  }

  return {
    filePath: path.isAbsolute(application.resumePath)
      ? application.resumePath
      : path.join(process.cwd(), application.resumePath),
    fileName: application.resumeOriginalName || path.basename(application.resumeStoredName),
  };
};

export const touchApplication = async (applicationId, patch = {}) => {
  const applications = await readCollection("applications");
  const application = assertApplicationExists(applications, applicationId);

  Object.assign(application, patch, { updatedAt: new Date().toISOString() });
  await writeCollection("applications", applications);

  return sanitizeApplication(application);
};
