import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApprovedReviews, submitReview } from "@/lib/site.functions";

const TITLE = "Client Reviews | Sarvagya Consultancy";
const DESC =
  "Read feedback from businesses we work with, and share your own experience of working with Sarvagya Consultancy.";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={
            n <= value ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

function ReviewsPage() {
  const fetchReviews = useServerFn(getApprovedReviews);
  const send = useServerFn(submitReview);
  const { data, isLoading } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: () => fetchReviews(),
  });

  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    const res = await send({
      data: {
        name: String(form.get("name") ?? ""),
        businessName: String(form.get("businessName") ?? ""),
        rating,
        feedback: String(form.get("feedback") ?? ""),
        recommend: form.get("recommend") !== "no",
        company: String(form.get("company") ?? ""),
      },
    });
    if (res.ok) setState("done");
    else {
      setState("idle");
      setError(res.error ?? "Something went wrong.");
    }
  }

  const reviews = data?.reviews ?? [];

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What working with us is like"
        lead="Reviews are published only after we verify them, so this page stays honest rather than crowded."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {isLoading ? (
          <p className="text-muted-foreground">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <Reveal className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              No published reviews yet
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              We publish feedback only once it has been verified. If you have worked with us, your
              review below would be the first.
            </p>
          </Reveal>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal
                as="li"
                key={r.id}
                delay={i * 60}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <Stars value={r.rating} />
                <p className="mt-4 leading-relaxed">{r.feedback}</p>
                <p className="mt-5 text-sm font-medium">{r.name}</p>
                {r.business_name && (
                  <p className="text-sm text-muted-foreground">{r.business_name}</p>
                )}
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Share your experience
          </h2>
          <p className="mt-3 text-muted-foreground">
            Your review is sent to us first and appears on this page once verified.
          </p>

          {state === "done" ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8">
              <p className="font-medium">Thank you — your review has been received.</p>
              <p className="mt-2 text-muted-foreground">
                It will appear here after we verify it.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 grid gap-5">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" name="name" required maxLength={100} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business name (optional)</Label>
                  <Input id="businessName" name="businessName" maxLength={120} />
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-medium">Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={rating === n}
                      className="rounded-md p-1"
                    >
                      <Star
                        aria-hidden="true"
                        className={
                          n <= rating
                            ? "h-6 w-6 fill-primary text-primary"
                            : "h-6 w-6 text-muted-foreground/40"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="feedback">Your feedback</Label>
                <Textarea id="feedback" name="feedback" required rows={5} maxLength={2000} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div>
                <Button type="submit" size="lg" disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Submit review"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
