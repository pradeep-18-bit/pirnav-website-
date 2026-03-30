import crypto from "node:crypto";
import { readCollection, writeCollection } from "./dataStoreService.js";
import { AppError } from "../utils/AppError.js";

const sortContacts = (contacts) =>
  [...contacts].sort((contactA, contactB) => {
    const dateA = Date.parse(contactA.createdDate || 0) || 0;
    const dateB = Date.parse(contactB.createdDate || 0) || 0;
    return dateB - dateA;
  });

const getContactRecord = (contacts, contactId) => {
  const contact = contacts.find((record) => String(record.id) === String(contactId));

  if (!contact) {
    throw new AppError("Contact message not found.", 404);
  }

  return contact;
};

export const listContactMessages = async () => {
  const contacts = await readCollection("contacts");
  return sortContacts(contacts);
};

export const getRecentMessages = async (limit = 4) => {
  const contacts = await listContactMessages();
  return contacts.slice(0, limit);
};

export const createContactMessage = async (payload) => {
  const contacts = await readCollection("contacts");
  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email.toLowerCase(),
    purposeOfContact: payload.purposeOfContact,
    subject: payload.subject || payload.purposeOfContact,
    message: payload.message,
    status: "Unread",
    createdDate: now,
  };

  await writeCollection("contacts", [record, ...contacts]);
  return record;
};

export const getUnreadMessageCount = async () => {
  const contacts = await readCollection("contacts");
  return contacts.filter((record) => record.status !== "Read").length;
};

export const getContactMessageById = async (contactId) => {
  const contacts = await readCollection("contacts");
  return getContactRecord(contacts, contactId);
};

export const markContactMessageAsRead = async (contactId) => {
  const contacts = await readCollection("contacts");
  const contact = getContactRecord(contacts, contactId);

  contact.status = "Read";
  await writeCollection("contacts", contacts);
  return contact;
};

export const deleteContactMessage = async (contactId) => {
  const contacts = await readCollection("contacts");
  const nextContacts = contacts.filter((record) => String(record.id) !== String(contactId));

  if (nextContacts.length === contacts.length) {
    throw new AppError("Contact message not found.", 404);
  }

  await writeCollection("contacts", nextContacts);
};
