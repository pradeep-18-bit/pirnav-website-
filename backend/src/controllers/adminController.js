import { loginAdmin, getDashboardSummary } from "../services/adminService.js";
import { getRecentMessages } from "../services/contactService.js";
import { getRecentApplications, shortlistApplication } from "../services/applicationService.js";
import { scheduleInterview } from "../services/interviewService.js";
import { sendSuccess } from "../utils/response.js";

export const login = async (request, response) => {
  const result = await loginAdmin(request.body);
  sendSuccess(response, {
    statusCode: 200,
    message: "Login successful.",
    data: result,
  });
};

export const dashboardSummary = async (_request, response) => {
  const summary = await getDashboardSummary();
  sendSuccess(response, {
    statusCode: 200,
    message: "Dashboard summary loaded.",
    data: summary,
  });
};

export const recentMessages = async (_request, response) => {
  const messages = await getRecentMessages();
  sendSuccess(response, {
    statusCode: 200,
    message: "Recent messages loaded.",
    data: messages,
  });
};

export const recentApplications = async (_request, response) => {
  const applications = await getRecentApplications();
  sendSuccess(response, {
    statusCode: 200,
    message: "Recent applications loaded.",
    data: applications,
  });
};

export const shortlistCandidate = async (request, response) => {
  const application = await shortlistApplication(request.body);
  sendSuccess(response, {
    statusCode: 200,
    message: "Candidate shortlisted and email sent.",
    data: application,
  });
};

export const scheduleCandidateInterview = async (request, response) => {
  const interview = await scheduleInterview(request.body);
  sendSuccess(response, {
    statusCode: 200,
    message: "Interview scheduled and email sent.",
    data: interview,
  });
};
