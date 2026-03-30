import { updateApplicationStatusSchema } from "../utils/schemas.js";
import {
  getApplicationResume,
  listApplications,
  submitApplication,
  updateApplicationStatus,
} from "../services/applicationService.js";
import { sendSuccess } from "../utils/response.js";

export const getApplications = async (_request, response) => {
  const applications = await listApplications();
  sendSuccess(response, {
    statusCode: 200,
    message: "Applications loaded.",
    data: applications,
  });
};

export const createApplication = async (request, response) => {
  const application = await submitApplication({
    fields: request.body,
    resumeFile: request.file,
  });
  sendSuccess(response, {
    statusCode: 201,
    message: "Application submitted successfully.",
    data: application,
  });
};

export const changeApplicationStatus = async (request, response) => {
  const payload = updateApplicationStatusSchema.parse(request.body);
  const application = await updateApplicationStatus({
    applicationId: request.params.id,
    status: payload.status,
  });

  sendSuccess(response, {
    statusCode: 200,
    message: "Application status updated.",
    data: application,
  });
};

export const downloadApplicationResume = async (request, response) => {
  const resume = await getApplicationResume(request.params.id);
  response.download(resume.filePath, resume.fileName);
};
