import { trackEvent } from "./site.functions";

const VISITOR_KEY = "sv_visitor_id";
const SEEN_KEY = "sv_returning";

function visitorContext() {
  if (typeof window === "undefined") return null;
  let id = "";
  let isNew = false;
  try {
    id = localStorage.getItem(VISITOR_KEY) ?? "";
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    isNew = !localStorage.getItem(SEEN_KEY);
    if (isNew) localStorage.setItem(SEEN_KEY, "1");
  } catch {
    id = "anonymous";
  }
  const width = window.innerWidth;
  const device = width < 640 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  return { id, isNew, device };
}

export function track(
  eventType: string,
  meta?: Record<string, string | number>,
) {
  if (typeof window === "undefined") return;
  const ctx = visitorContext();
  if (!ctx) return;
  void trackEvent({
    data: {
      eventType,
      path: window.location.pathname,
      referrer: document.referrer ?? "",
      device: ctx.device,
      visitorId: ctx.id,
      isNewVisitor: ctx.isNew,
      ...(meta ? { meta } : {}),
    },
  }).catch(() => undefined);
}
