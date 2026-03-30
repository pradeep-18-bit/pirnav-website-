import { jsonRequest } from "./apiClient";

const contactBasePath = "/api/contact";

export const submitContactMessage = async (payload) => {
  const response = await jsonRequest(contactBasePath, {
    method: "POST",
    body: payload,
  });

  return response.data;
};

export const getContactMessages = async (headers) => {
  const response = await jsonRequest(contactBasePath, { headers });
  return response.data || [];
};

export const getUnreadContactCount = async (headers) => {
  const response = await jsonRequest(`${contactBasePath}/unread-count`, { headers });
  return response.data?.unread || 0;
};

export const getContactMessage = async ({ messageId, headers }) => {
  const response = await jsonRequest(`${contactBasePath}/${messageId}`, { headers });
  return response.data;
};

export const markContactMessageRead = async ({ messageId, headers }) => {
  const response = await jsonRequest(`${contactBasePath}/mark-read/${messageId}`, {
    method: "PUT",
    headers,
  });

  return response.data;
};

export const deleteContactMessage = async ({ messageId, headers }) => {
  await jsonRequest(`${contactBasePath}/${messageId}`, {
    method: "DELETE",
    headers,
  });
};
