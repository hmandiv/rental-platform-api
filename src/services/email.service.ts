import { Resend } from "resend";
import { env } from "../config/env";
import { AppError } from "../utils/appError";
import { SendVerificationEmailInput } from "../types/email";

const resend = new Resend(env.RESEND_API_KEY);

const escapeHtml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const sendVerificationEmail = async ({
  to,
  name,
  verificationLink,
}: SendVerificationEmailInput): Promise<void> => {
  const safeName = escapeHtml(name.trim() || "there");
  const safeVerificationLink = escapeHtml(verificationLink);

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: "Verify your Direct Rent email",
    html: `
      <!doctype html>
      <html>
        <body style="margin:0;padding:0;background:#f6f5f2;font-family:Arial,sans-serif;color:#1f2933;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f5f2;padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e6e1d8;">
                  <tr>
                    <td>
                      <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#8a6f3d;font-weight:700;">
                        Direct Rent
                      </p>

                      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#111827;">
                        Verify your email
                      </h1>

                      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4b5563;">
                        Hi ${safeName},
                      </p>

                      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">
                        Thanks for creating a Direct Rent owner account. Please verify your email address before creating or managing property listings.
                      </p>

                      <p style="margin:0 0 28px;">
                        <a href="${safeVerificationLink}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:700;">
                          Verify email
                        </a>
                      </p>

                      <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#6b7280;">
                        If the button does not work, copy and paste this link into your browser:
                      </p>

                      <p style="margin:0 0 24px;font-size:12px;line-height:1.6;color:#6b7280;word-break:break-all;">
                        ${safeVerificationLink}
                      </p>

                      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
                        If you did not create this account, you can ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: [
      `Hi ${name.trim() || "there"},`,
      "",
      "Thanks for creating a Direct Rent owner account.",
      "Please verify your email address before creating or managing property listings.",
      "",
      `Verify your email: ${verificationLink}`,
      "",
      "If you did not create this account, you can ignore this email.",
    ].join("\n"),
  });

  if (error) {
    console.error("Resend verification email failed", error);

    throw new AppError(
      "Verification email could not be sent. Please try again.",
      502,
    );
  }
};
