import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const formatInterviewDateTime = (interviewDate, interviewTime) => {
  const parsed = new Date(`${String(interviewDate).slice(0, 10)}T${String(interviewTime).slice(0, 8)}`);

  if (Number.isNaN(parsed.getTime())) {
    return `${interviewDate} ${interviewTime}`;
  }

  return parsed.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
};

const hasSmtpConfig = Boolean(
  env.email.host && env.email.port && env.email.user && env.email.pass
);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.email.host,
      port: env.email.port,
      secure: env.email.secure,
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    })
  : nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });

const sendMail = async ({ to, subject, text, html }) => {
  const result = await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html,
  });

  if (!hasSmtpConfig) {
    console.log("[email] SMTP env vars are missing, generated preview email instead.");
    console.log(result.message?.toString() || result.message);
  }

  return result;
};

export const sendShortlistedEmail = async ({ candidateName, candidateEmail, nextSteps }) =>
  sendMail({
    to: candidateEmail,
    subject: "Pirnav application update: shortlisted",
    text: [
      `Hi ${candidateName},`,
      "",
      "Status: Shortlisted",
      "",
      "Congratulations. Your application has been shortlisted by our hiring team.",
      `Next steps: ${nextSteps}`,
      "",
      "Regards,",
      "Pirnav Hiring Team",
    ].join("\n"),
    html: `
      <p>Hi ${candidateName},</p>
      <p><strong>Status:</strong> Shortlisted</p>
      <p>Congratulations. Your application has been shortlisted by our hiring team.</p>
      <p><strong>Next steps:</strong> ${nextSteps}</p>
      <p>Regards,<br />Pirnav Hiring Team</p>
    `,
  });

export const sendInterviewScheduledEmail = async ({
  candidateName,
  candidateEmail,
  interviewDate,
  interviewTime,
  mode,
  instructions,
  meetingLink,
}) =>
  sendMail({
    to: candidateEmail,
    subject: "Pirnav interview schedule",
    text: [
      `Hi ${candidateName},`,
      "",
      "Your interview has been scheduled.",
      `Interview date & time: ${formatInterviewDateTime(interviewDate, interviewTime)}`,
      `Mode: ${mode}`,
      `Instructions: ${instructions}`,
      meetingLink ? `Meeting link: ${meetingLink}` : "",
      "",
      "Regards,",
      "Pirnav Hiring Team",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <p>Hi ${candidateName},</p>
      <p>Your interview has been scheduled.</p>
      <p><strong>Interview date &amp; time:</strong> ${formatInterviewDateTime(
        interviewDate,
        interviewTime
      )}</p>
      <p><strong>Mode:</strong> ${mode}</p>
      <p><strong>Instructions:</strong> ${instructions}</p>
      ${meetingLink ? `<p><strong>Meeting link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
      <p>Regards,<br />Pirnav Hiring Team</p>
    `,
  });
