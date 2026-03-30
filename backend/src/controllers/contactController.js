import {
  createContactMessage,
  deleteContactMessage,
  getContactMessageById,
  getUnreadMessageCount,
  listContactMessages,
  markContactMessageAsRead,
} from "../services/contactService.js";
import { sendSuccess } from "../utils/response.js";

export const getMessages = async (_request, response) => {
  const messages = await listContactMessages();
  sendSuccess(response, {
    statusCode: 200,
    message: "Messages loaded.",
    data: messages,
  });
};

export const submitMessage = async (request, response) => {
  const message = await createContactMessage(request.body);
  sendSuccess(response, {
    statusCode: 201,
    message: "Message received.",
    data: message,
  });
};

export const getMessage = async (request, response) => {
  const message = await getContactMessageById(request.params.id);
  sendSuccess(response, {
    statusCode: 200,
    message: "Message loaded.",
    data: message,
  });
};

export const unreadCount = async (_request, response) => {
  const unread = await getUnreadMessageCount();
  sendSuccess(response, {
    statusCode: 200,
    message: "Unread message count loaded.",
    data: { unread },
  });
};

export const markAsRead = async (request, response) => {
  const message = await markContactMessageAsRead(request.params.id);
  sendSuccess(response, {
    statusCode: 200,
    message: "Message marked as read.",
    data: message,
  });
};

export const deleteMessage = async (request, response) => {
  await deleteContactMessage(request.params.id);
  sendSuccess(response, {
    statusCode: 200,
    message: "Message deleted.",
  });
};
