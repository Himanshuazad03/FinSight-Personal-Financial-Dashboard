import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set in environment variables");
      throw new Error("RESEND_API_KEY is missing");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "FinSight <onboarding@resend.dev>", // Make sure this domain is verified in Resend
      to: [to], // Resend expects an array
      subject,
      react,
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    // Return error instead of throwing to prevent function failure
    return { success: false, error: error.message };
  }
}