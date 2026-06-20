/**
 * Transactional Email Engine
 * Integrates with SendGrid for sending transactional emails
 * All keys/URLs sourced from environment variables
 */

type EmailTemplate =
  | "welcome"
  | "kyc-approved"
  | "kyc-rejected"
  | "investment-confirmed"
  | "property-created"
  | "dividend-paid"
  | "password-reset"
  | "email-verification"
  | "login-alert"
  | "withdrawal-processed";

interface EmailPayload {
  to: string;
  subject: string;
  template: EmailTemplate;
  data?: Record<string, string | number | boolean>;
}

/**
 * Send transactional email via SendGrid
 * Falls back gracefully if SENDGRID_API_KEY is not configured
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const { to, subject, template, data = {} } = payload;

  // Skip if no API key configured
  if (!process.env.SENDGRID_API_KEY) {
    console.warn(`[EMAIL] SendGrid not configured. Skipping email to ${to} for template: ${template}`);
    return false;
  }

  try {
    const dynamicTemplateData = {
      subject,
      userName: data.userName || "Investor",
      userEmail: to,
      propertyName: data.propertyName,
      propertyTitle: data.propertyTitle,
      amount: data.amount,
      currency: data.currency || "USD",
      status: data.status,
      reason: data.reason,
      loginTime: new Date().toLocaleString(),
      loginIp: data.ipAddress || "Unknown",
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://realtyx.io"}/dashboard`,
      adminUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://realtyx.io"}/admin`,
      year: new Date().getFullYear(),
      ...data,
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            dynamic_template_data: dynamicTemplateData,
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || "noreply@realtyx.io",
          name: process.env.SENDGRID_FROM_NAME || "RealtyX",
        },
        template_id: getTemplateId(template),
        content: [
          {
            type: "text/plain",
            value: `Email: ${subject}\n\nPlease enable HTML emails for rich content.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`[EMAIL] SendGrid error: ${response.status} ${await response.text()}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send email:", error);
    return false;
  }
}

/**
 * Get SendGrid template ID for each template type
 */
function getTemplateId(template: EmailTemplate): string {
  const templates: Record<EmailTemplate, string> = {
    welcome: process.env.SENDGRID_TEMPLATE_WELCOME || "d-welcome",
    "kyc-approved": process.env.SENDGRID_TEMPLATE_KYC_APPROVED || "d-kyc-approved",
    "kyc-rejected": process.env.SENDGRID_TEMPLATE_KYC_REJECTED || "d-kyc-rejected",
    "investment-confirmed": process.env.SENDGRID_TEMPLATE_INVESTMENT || "d-investment",
    "property-created": process.env.SENDGRID_TEMPLATE_PROPERTY_CREATED || "d-property-created",
    "dividend-paid": process.env.SENDGRID_TEMPLATE_DIVIDEND || "d-dividend",
    "password-reset": process.env.SENDGRID_TEMPLATE_PASSWORD_RESET || "d-password-reset",
    "email-verification": process.env.SENDGRID_TEMPLATE_VERIFICATION || "d-verification",
    "login-alert": process.env.SENDGRID_TEMPLATE_LOGIN_ALERT || "d-login-alert",
    "withdrawal-processed": process.env.SENDGRID_TEMPLATE_WITHDRAWAL || "d-withdrawal",
  };
  return templates[template];
}

/**
 * Send SMS notification via Termii
 */
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (!process.env.TERMII_API_KEY || !process.env.TERMII_SENDER_ID) {
    console.warn("[SMS] Termii not configured. Skipping SMS.");
    return false;
  }

  try {
    const response = await fetch("https://api.termii.com/api/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.TERMII_API_KEY,
        to: phone,
        from: process.env.TERMII_SENDER_ID,
        sms: message,
        type: "plain",
        channel: "generic",
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Broadcast notification to all users about a new property
 */
export async function broadcastPropertyCreation(propertyTitle: string, propertyId: string): Promise<void> {
  const { db } = await import("@/lib/db");

  // Find all users with notification preferences enabled
  const users = await db.user.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      settings: true,
      profile: true,
    },
  });

  // Create in-app notifications
  const notifications = users.map((user) => ({
    userId: user.id,
    title: "New Property Available",
    message: `${propertyTitle} is now available for investment on RealtyX.`,
    type: "PROPERTY",
    link: `/invest/${propertyId}`,
  }));

  // Batch insert notifications
  await db.notification.createMany({ data: notifications });

  // Send emails to users who opted in
  for (const user of users) {
    if (user.settings?.emailAlerts !== false) {
      await sendEmail({
        to: user.email,
        subject: `New Investment Opportunity: ${propertyTitle}`,
        template: "property-created",
        data: {
          userName: user.name || user.profile?.firstName || "Investor",
          propertyName: propertyTitle,
          propertyTitle,
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://realtyx.io"}/invest/${propertyId}`,
        },
      }).catch(() => {});
    }
  }

  // Log the broadcast
  console.log(`[NOTIFICATION] Property broadcast sent to ${users.length} users for: ${propertyTitle}`);
}