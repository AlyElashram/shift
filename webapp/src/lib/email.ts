import { Resend } from "resend";

// Lazy-load Resend client to avoid crashing when API key is not set
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured. Email sending is disabled.");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
  }[];
}

export async function sendEmail(options: EmailOptions) {
  const client = getResendClient();
  const fromEmail = process.env.EMAIL_FROM || "SHIFT By Joe <noreply@shiftbyjoe.com>";

  try {
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    if (error) {
      console.error("Email send error:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export function generateStatusUpdateEmail(data: {
  ownerName: string;
  manufacturer: string;
  model: string;
  statusName: string;
  trackingUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipment Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; border-bottom: 1px solid #333;">
              <h1 style="margin: 0; color: #FFD628; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                SHIFT <span style="font-style: italic; font-weight: normal; text-transform: none;">By Joe</span>
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; color: #FCFBE4; font-size: 18px;">
                Hello ${data.ownerName},
              </p>

              <p style="margin: 0 0 24px; color: #9A9A9A; font-size: 16px; line-height: 1.6;">
                Great news! Your shipment status has been updated.
              </p>

              <!-- Status Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px; color: #6B6B6B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Vehicle
                    </p>
                    <p style="margin: 0 0 16px; color: #FCFBE4; font-size: 20px; font-weight: bold;">
                      ${data.manufacturer} ${data.model}
                    </p>
                    <p style="margin: 0 0 8px; color: #6B6B6B; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      New Status
                    </p>
                    <p style="margin: 0; color: #FFD628; font-size: 18px; font-weight: bold;">
                      ${data.statusName}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.trackingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #FFD628; color: #000000; font-size: 14px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">
                      Track Your Shipment
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #333; text-align: center;">
              <p style="margin: 0; color: #6B6B6B; font-size: 14px;">
                Questions? Contact us at support@shiftbyjoe.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function generateThankYouEmail(data: {
  ownerName: string;
  manufacturer: string;
  model: string;
  trackingUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Choosing SHIFT By Joe</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; border-bottom: 1px solid #333;">
              <h1 style="margin: 0; color: #FFD628; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                SHIFT <span style="font-style: italic; font-weight: normal; text-transform: none;">By Joe</span>
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 24px; color: #FCFBE4; font-size: 24px; font-weight: bold;">
                Thank You for Choosing Us!
              </h2>

              <p style="margin: 0 0 24px; color: #9A9A9A; font-size: 16px; line-height: 1.6;">
                Dear ${data.ownerName},
              </p>

              <p style="margin: 0 0 24px; color: #9A9A9A; font-size: 16px; line-height: 1.6;">
                Thank you for trusting SHIFT By Joe with the import of your <strong style="color: #FCFBE4;">${data.manufacturer} ${data.model}</strong>. We're committed to delivering your vehicle safely and keeping you informed every step of the way.
              </p>

              <p style="margin: 0 0 24px; color: #9A9A9A; font-size: 16px; line-height: 1.6;">
                You can track your shipment anytime using the link below:
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.trackingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #FFD628; color: #000000; font-size: 14px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">
                      Track Your Shipment
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #9A9A9A; font-size: 16px; line-height: 1.6;">
                We'll send you email updates as your vehicle progresses through each stage of the shipping process.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #333; text-align: center;">
              <p style="margin: 0 0 8px; color: #FCFBE4; font-size: 14px; font-weight: bold;">
                SHIFT By Joe
              </p>
              <p style="margin: 0; color: #6B6B6B; font-size: 14px;">
                Premium Car Imports from UAE to Egypt
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
