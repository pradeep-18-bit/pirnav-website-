import crypto from "node:crypto";
import { readCollection, writeCollection } from "./dataStoreService.js";
import { sendInterviewScheduledEmail } from "./emailService.js";
import { AppError } from "../utils/AppError.js";
import { touchApplication } from "./applicationService.js";

const DEFAULT_INTERVIEW_INSTRUCTIONS =
  "Please join 10 minutes early and keep a copy of your resume handy during the discussion.";

const normalizeInterviewDate = (value) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError("Interview date must be a valid date.", 400);
  }

  return parsed.toISOString().slice(0, 10);
};

const normalizeInterviewTime = (value) => {
  const [hours = "00", minutes = "00", seconds = "00"] = String(value || "").split(":");
  const numericHours = Number.parseInt(hours, 10);
  const numericMinutes = Number.parseInt(minutes, 10);

  if (
    Number.isNaN(numericHours) ||
    Number.isNaN(numericMinutes) ||
    numericHours < 0 ||
    numericHours > 23 ||
    numericMinutes < 0 ||
    numericMinutes > 59
  ) {
    throw new AppError("Interview time must be a valid time.", 400);
  }

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};

const getInterviewStatus = (value) => {
  const normalized = String(value || "scheduled").toLowerCase();
  const allowedStatuses = new Set(["scheduled", "completed", "cancelled"]);
  return allowedStatuses.has(normalized) ? normalized : "scheduled";
};

const sanitizeInterview = (interview, application) => ({
  ...interview,
  applicationId: interview.applicationId,
  candidateName: application?.name || "Unknown candidate",
  email: application?.email || "",
  jobTitle: application?.jobTitle || "Not assigned",
  applicationStatus: application?.status || "pending",
  managerName: interview.managerName || `Manager #${interview.managerId || 1}`,
});

const getInterviewRecord = (interviews, interviewId) => {
  const interview = interviews.find((record) => String(record.id) === String(interviewId));

  if (!interview) {
    throw new AppError("Interview not found.", 404);
  }

  return interview;
};

const getApplicationRecord = (applications, applicationId) => {
  const application = applications.find((record) => String(record.id) === String(applicationId));

  if (!application) {
    throw new AppError("Application not found.", 404);
  }

  return application;
};

const buildInterviewRecord = ({ applicationId, payload, existingRecord = null }) => {
  const now = new Date().toISOString();
  const mode = payload.mode === "Offline" ? "Offline" : "Online";

  if (mode === "Online" && !String(payload.meetingLink || "").trim()) {
    throw new AppError("Meeting link is required for online interviews.", 400);
  }

  return {
    id: existingRecord?.id || crypto.randomUUID(),
    applicationId,
    interviewDate: normalizeInterviewDate(payload.interviewDate),
    interviewTime: normalizeInterviewTime(payload.interviewTime),
    mode,
    meetingLink: mode === "Online" ? String(payload.meetingLink || "").trim() : "",
    instructions:
      String(payload.instructions || payload.notes || "").trim() || DEFAULT_INTERVIEW_INSTRUCTIONS,
    notes: String(payload.notes || payload.instructions || "").trim(),
    managerId: String(payload.managerId || existingRecord?.managerId || "1"),
    managerName:
      String(payload.managerName || existingRecord?.managerName || "").trim() ||
      `Manager #${payload.managerId || existingRecord?.managerId || "1"}`,
    status: getInterviewStatus(payload.status || existingRecord?.status),
    createdAt: existingRecord?.createdAt || now,
    updatedAt: now,
  };
};

const notifyCandidate = async (application, interview) =>
  sendInterviewScheduledEmail({
    candidateName: application.name,
    candidateEmail: application.email,
    interviewDate: interview.interviewDate,
    interviewTime: interview.interviewTime,
    mode: interview.mode,
    instructions: interview.instructions,
    meetingLink: interview.meetingLink,
  });

export const listInterviews = async () => {
  const [interviews, applications] = await Promise.all([
    readCollection("interviews"),
    readCollection("applications"),
  ]);

  return interviews
    .map((interview) => {
      const application = applications.find(
        (record) => String(record.id) === String(interview.applicationId)
      );

      return sanitizeInterview(interview, application);
    })
    .sort((interviewA, interviewB) => {
      const timeA = Date.parse(`${interviewA.interviewDate}T${interviewA.interviewTime}`) || 0;
      const timeB = Date.parse(`${interviewB.interviewDate}T${interviewB.interviewTime}`) || 0;
      return timeA - timeB;
    });
};

export const scheduleInterview = async (payload) => {
  const [interviews, applications] = await Promise.all([
    readCollection("interviews"),
    readCollection("applications"),
  ]);
  const application = getApplicationRecord(applications, payload.applicationId);
  const existingInterview = interviews.find(
    (record) => String(record.applicationId) === String(payload.applicationId)
  );
  const interview = buildInterviewRecord({
    applicationId: application.id,
    payload,
    existingRecord: existingInterview || null,
  });

  const nextInterviews = existingInterview
    ? interviews.map((record) => (record.id === existingInterview.id ? interview : record))
    : [...interviews, interview];

  await writeCollection("interviews", nextInterviews);
  await touchApplication(application.id);
  await notifyCandidate(application, interview);

  return sanitizeInterview(interview, application);
};

export const updateInterview = async (interviewId, payload) => {
  const [interviews, applications] = await Promise.all([
    readCollection("interviews"),
    readCollection("applications"),
  ]);
  const existingInterview = getInterviewRecord(interviews, interviewId);
  const application = getApplicationRecord(applications, existingInterview.applicationId);
  const nextInterview = buildInterviewRecord({
    applicationId: existingInterview.applicationId,
    payload,
    existingRecord: existingInterview,
  });

  const nextInterviews = interviews.map((record) =>
    record.id === existingInterview.id ? nextInterview : record
  );

  await writeCollection("interviews", nextInterviews);
  await touchApplication(application.id);
  await notifyCandidate(application, nextInterview);

  return sanitizeInterview(nextInterview, application);
};
