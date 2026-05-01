"use server";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (!name || !email || !message) {
    return { success: false, error: "Missing required fields" };
  }

  // Here you would normally integrate with an email service or database
  // e.g. Resend, SendGrid, or just saving to your DB.
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Form submitted:", { name, email, subject, message });

  return { success: true };
}
