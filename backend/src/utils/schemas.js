import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email address.");
const optionalUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .optional()
  .or(z.literal(""));

const nonEmptyString = (message) => z.string().trim().min(1, message);
const optionalString = () => z.string().trim().optional().or(z.literal(""));

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: nonEmptyString("Password is required."),
});

export const shortlistCandidateSchema = z.object({
  applicationId: nonEmptyString("Application id is required."),
  nextSteps: optionalString(),
});

export const scheduleInterviewSchema = z.object({
  applicationId: nonEmptyString("Application id is required."),
  interviewDate: nonEmptyString("Interview date is required."),
  interviewTime: nonEmptyString("Interview time is required."),
  mode: z.enum(["Online", "Offline"], {
    required_error: "Interview mode is required.",
  }),
  meetingLink: optionalUrlSchema,
  instructions: optionalString(),
  notes: optionalString(),
  managerId: optionalString(),
  status: optionalString(),
});

export const contactMessageSchema = z.object({
  name: nonEmptyString("Name is required."),
  email: emailSchema,
  purposeOfContact: nonEmptyString("Purpose of contact is required."),
  subject: optionalString(),
  message: nonEmptyString("Message is required."),
});

export const jobSchema = z.object({
  jobTitle: nonEmptyString("Job title is required."),
  workLocation: nonEmptyString("Work location is required."),
  jobType: nonEmptyString("Job type is required."),
  status: z.enum(["open", "closed"]),
  experience: nonEmptyString("Experience is required."),
  ctc: nonEmptyString("CTC is required."),
  highestQualification: nonEmptyString("Highest qualification is required."),
  jobDescription: nonEmptyString("Job description is required."),
  mandatorySkills: nonEmptyString("Mandatory skills are required."),
});

export const jobApplicationSchema = z.object({
  jobId: nonEmptyString("Job id is required."),
  name: nonEmptyString("Name is required."),
  email: emailSchema,
  phoneNumber: nonEmptyString("Phone number is required."),
  dateOfBirth: nonEmptyString("Date of birth is required."),
  gender: nonEmptyString("Gender is required."),
  highestQualification: nonEmptyString("Highest qualification is required."),
  totalExperience: nonEmptyString("Experience is required."),
  currentCompany: nonEmptyString("Current company is required."),
  currentCTC: nonEmptyString("Current CTC is required."),
  expectedCTC: nonEmptyString("Expected CTC is required."),
  noticePeriod: nonEmptyString("Notice period is required."),
  currentLocation: nonEmptyString("Current location is required."),
  linkedInUrl: optionalUrlSchema,
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["pending", "shortlisted", "selected", "rejected"]),
});

export const interviewUpdateSchema = z.object({
  interviewDate: nonEmptyString("Interview date is required."),
  interviewTime: nonEmptyString("Interview time is required."),
  mode: z.enum(["Online", "Offline"], {
    required_error: "Interview mode is required.",
  }),
  meetingLink: optionalUrlSchema,
  instructions: optionalString(),
  notes: optionalString(),
  managerId: optionalString(),
  status: optionalString(),
});

export const routeIdSchema = z.object({
  id: nonEmptyString("Id is required."),
});
