import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({
  to,
  subject,
  html,
  from = "RealtyX <noreply@realtyx.io>",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!resend) {
    console.log("Email would send:", { to, subject });
    return { id: "mock-email-id" };
  }
  
  try {
    const result = await resend.emails.send({ from, to, subject, html });
    return result;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to RealtyX — Start Building Your Portfolio",
    html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0a;color:#fff;border-radius:16px;">
      <h1 style="color:#d4a017;font-size:28px;margin-bottom:16px;">Welcome to RealtyX, ${name}</h1>
      <p style="color:#888;font-size:16px;line-height:1.6;">You now have access to premium fractional real estate investments. Complete your KYC verification to start investing.</p>
      <a href="https://realtyx.io/dashboard" style="display:inline-block;margin-top:24px;padding:12px 24px;background:linear-gradient(135deg,#d4a017,#b8860b);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Launch Dashboard</a>
    </div>`,
  });
}

export async function sendKYCUpdateEmail(email: string, status: string) {
  const colors: Record<string, string> = { approved: "#22c55e", rejected: "#ef4444", pending: "#eab308" };
  return sendEmail({
    to: email,
    subject: `KYC Verification ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0a;color:#fff;border-radius:16px;">
      <h1 style="color:${colors[status] || "#d4a017"};font-size:28px;margin-bottom:16px;">KYC ${status.toUpperCase()}</h1>
      <p style="color:#888;font-size:16px;line-height:1.6;">Your identity verification has been ${status}. ${status === "approved" ? "You can now start investing." : "Please contact support for assistance."}</p>
    </div>`,
  });
}

export async function sendDistributionEmail(email: string, property: string, amount: string) {
  return sendEmail({
    to: email,
    subject: `Rental Distribution: ${property}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0a0a;color:#fff;border-radius:16px;">
      <h1 style="color:#d4a017;font-size:28px;margin-bottom:16px;">Distribution Received</h1>
      <p style="color:#888;font-size:16px;line-height:1.6;">You received <strong style="color:#22c55e;">${amount}</strong> in rental yield from <strong>${property}</strong>.</p>
    </div>`,
  });
}