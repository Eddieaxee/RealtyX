import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // In production, this would send an email via Resend or similar service
    // For now, log the contact form submission
    if (process.env.NODE_ENV === "development") {
      console.log("[CONTACT_FORM]", { name, email, subject, message });
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We will get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("[CONTACT_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 }
    );
  }
}