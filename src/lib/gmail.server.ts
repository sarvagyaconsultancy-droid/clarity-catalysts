// Server-only Gmail sending via the Lovable connector gateway.
// Sends from the connected Gmail account (sarvagyaconsultancy@gmail.com).

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

export const OWNER_EMAIL = "sarvagyaconsultancy@gmail.com";

const b64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

function rawEmail(to: string, subject: string, body: string) {
  const email = [
    `To: ${to}`,
    `From: ${header("Sarvagya Consultancy")} <${OWNER_EMAIL}>`,
    `Subject: ${header(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body,
  ].join("\r\n");
  return b64(email).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Send one plain-text email through the connected Gmail account. Never throws. */
export async function sendGmail(to: string, subject: string, body: string) {
  try {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_MAIL_API_KEY"];
    if (!lovableKey || !connectionKey) {
      console.error("gmail send skipped: missing gateway credentials");
      return;
    }
    const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: rawEmail(to, subject, body) }),
    });
    if (!res.ok) {
      console.error(`gmail send failed [${res.status}]: ${await res.text()}`);
    }
  } catch (err) {
    console.error("gmail send error", err);
  }
}

function formatSlot(date: string, time: string) {
  const d = new Date(`${date}T00:00:00`);
  const day = d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [h, m] = time.split(":").map(Number);
  const hour = h ?? 0;
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${day} at ${hr}:${String(m ?? 0).padStart(2, "0")} ${suffix} IST`;
}

export function bookingOwnerEmail(data: {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  slotDate: string;
  slotTime: string;
  requirement: string;
}) {
  return {
    subject: `New consultation request — ${data.name}`,
    body: [
      "A visitor has requested a free consultation on the website.",
      "",
      `Name: ${data.name}`,
      data.businessName ? `Business: ${data.businessName}` : null,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      `Preferred slot: ${formatSlot(data.slotDate, data.slotTime)}`,
      "",
      data.requirement ? `What they'd like to discuss:\n${data.requirement}` : null,
      "",
      "Please confirm the slot with them directly before the call.",
    ]
      .filter((l) => l !== null)
      .join("\n"),
  };
}

export function bookingVisitorEmail(data: {
  name: string;
  slotDate: string;
  slotTime: string;
}) {
  return {
    subject: "Your consultation request — Sarvagya Consultancy",
    body: [
      `Hi ${data.name},`,
      "",
      "Thank you for booking a free consultation with Sarvagya Consultancy.",
      "",
      `Your preferred slot: ${formatSlot(data.slotDate, data.slotTime)}`,
      "",
      "We have received your request and will confirm the time with you shortly before the call.",
      "",
      "If you need to change anything, just reply to this email.",
      "",
      "Warm regards,",
      "Sarvagya Consultancy",
      "Virtual. Reliable. Growth Focused.",
    ].join("\n"),
  };
}
