import { listInterviews, updateInterview } from "../services/interviewService.js";
import { sendSuccess } from "../utils/response.js";

export const getInterviews = async (_request, response) => {
  const interviews = await listInterviews();
  sendSuccess(response, {
    statusCode: 200,
    message: "Interviews loaded.",
    data: interviews,
  });
};

export const updateInterviewRecord = async (request, response) => {
  const interview = await updateInterview(request.params.id, request.body);
  sendSuccess(response, {
    statusCode: 200,
    message: "Interview updated and email sent.",
    data: interview,
  });
};
