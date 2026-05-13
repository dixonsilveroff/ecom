import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// In production, these would be process.env variables
// NEXT_PUBLIC_EMAILJS_SERVICE_ID, EMAILJS_PRIVATE_KEY, etc.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, cart } = body;

    if (!customer || !customer.name || !cart || cart.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // 1. In a full implementation, we would validate cart prices against the DB here
    // For now, we trust the incoming cart structure for the MVP transition.

    // 2. Fetch store settings to get the configured WhatsApp number
    let settings: any = { whatsapp_number: "1234567890" }; // fallback
    try {
      const dataPath = path.join(process.cwd(), "legacy", "data", "settings.json");
      const jsonData = await fs.readFile(dataPath, "utf8");
      settings = JSON.parse(jsonData);
    } catch (e) {
      console.warn("Could not read settings.json for whatsapp number");
    }

    // 3. Format the WhatsApp Message
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    let orderSummary = `*New Order: ${orderId}*\n\n`;
    orderSummary += `*Customer Details:*\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nAddress: ${customer.address}\n\n`;
    orderSummary += `*Order Items:*\n`;

    let total = 0;
    cart.forEach((item: any) => {
      orderSummary += `- ${item.quantity}x ${item.name} (${item.price})\n`;
      total += item.price * item.quantity;
    });
    orderSummary += `\n*Total:* ${total.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(orderSummary);
    // Ensure number doesn't have + or spaces
    const cleanNumber = settings.whatsapp_number.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // 4. Ideally, trigger EmailJS securely from the server here
    /*
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, // Note: Use private key in real implementation if supported by emailjs server API
        template_params: {
          to_name: "Admin",
          order_id: orderId,
          message: orderSummary
        }
      })
    });
    */

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        whatsappRedirectUrl: whatsappUrl,
      }
    });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: "Internal server error processing checkout" }, { status: 500 });
  }
}
