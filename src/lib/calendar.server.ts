const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

type Booking = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  slotDate: string;
  slotTime: string;
  requirement: string;
};

export type CalendarBooking = { eventId: string; meetLink: string | null };

function endTime(time: string, minutes = 30) {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Creates the owner event and Meet room. Returns null without interrupting the booking. */
export async function createConsultationEvent(data: Booking): Promise<CalendarBooking | null> {
  try {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_CALENDAR_API_KEY"];
    if (!lovableKey || !connectionKey) {
      console.error("calendar event skipped: missing gateway credentials");
      return null;
    }

    const description = [
      "Free consultation booked through the Sarvagya Consultancy website.",
      "",
      `Visitor: ${data.name}`,
      data.businessName ? `Business: ${data.businessName}` : null,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.requirement ? `Discussion: ${data.requirement}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const response = await fetch(
      `${GATEWAY_URL}/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": connectionKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `Free consultation — ${data.name}`,
          description,
          start: { dateTime: `${data.slotDate}T${data.slotTime}:00+05:30`, timeZone: "Asia/Kolkata" },
          end: {
            dateTime: `${data.slotDate}T${endTime(data.slotTime)}:00+05:30`,
            timeZone: "Asia/Kolkata",
          },
          attendees: [{ email: data.email, displayName: data.name }],
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      console.error(`calendar event failed [${response.status}]: ${await response.text()}`);
      return null;
    }

    const event = (await response.json()) as {
      id?: string;
      hangoutLink?: string;
      conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
    };
    if (!event.id) return null;
    const meetLink =
      event.hangoutLink ??
      event.conferenceData?.entryPoints?.find((point) => point.entryPointType === "video")?.uri ??
      null;
    return { eventId: event.id, meetLink };
  } catch (error) {
    console.error("calendar event error", error);
    return null;
  }
}