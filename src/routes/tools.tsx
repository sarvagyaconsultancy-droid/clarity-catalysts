import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, CircleDollarSign, ClipboardCheck, RotateCcw, TimerReset, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/PageHero";

const TITLE = "Free Business Finance Tools | Sarvagya Consultancy";
const DESC = "Use practical GST, break-even, working-capital, receivables and bookkeeping-readiness tools for Indian businesses.";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const num = (value: string) => Math.max(0, Number(value) || 0);

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return <div><Label htmlFor={id}>{label}</Label><Input id={id} type="number" min="0" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className="mt-2" /></div>;
}

function Result({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-lg bg-secondary p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl font-semibold text-primary">{value}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p></div>;
}

function ToolFrame({ title, intro, children, result }: { title: string; intro: string; children: React.ReactNode; result: React.ReactNode }) {
  return <div className="grid gap-8 py-7 lg:grid-cols-[1fr_0.9fr]"><div><h2 className="font-display text-2xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p><div className="mt-7 grid gap-4 sm:grid-cols-2">{children}</div></div><div className="lg:border-l lg:border-border lg:pl-8">{result}</div></div>;
}

function ToolsPage() {
  const [gstBase, setGstBase] = useState("100000");
  const [gstRate, setGstRate] = useState("18");
  const [fixed, setFixed] = useState("150000");
  const [price, setPrice] = useState("1000");
  const [variable, setVariable] = useState("600");
  const [assets, setAssets] = useState("800000");
  const [liabilities, setLiabilities] = useState("500000");
  const [receivables, setReceivables] = useState("600000");
  const [overdue, setOverdue] = useState("180000");
  const [sales, setSales] = useState("2400000");
  const [checked, setChecked] = useState<number[]>([]);

  const gst = num(gstBase) * num(gstRate) / 100;
  const contribution = num(price) - num(variable);
  const breakEven = contribution > 0 ? num(fixed) / contribution : 0;
  const workingCapital = num(assets) - num(liabilities);
  const overdueShare = num(receivables) > 0 ? num(overdue) / num(receivables) * 100 : 0;
  const debtorDays = num(sales) > 0 ? num(receivables) / num(sales) * 365 : 0;
  const checklist = ["Bank accounts are reconciled monthly", "Sales and purchase records are complete", "GST records match the books", "Receivables are reviewed by age", "Expenses have supporting documents", "Monthly reports reach the owner on time", "Payroll records and deductions are complete", "Data is backed up with controlled access"];
  const readiness = Math.round(checked.length / checklist.length * 100);

  return (
    <>
      <PageHero eyebrow="Finance tools" title={<>Useful numbers.<span className="block text-primary">Clearer business conversations.</span></>} lead="Five practical self-checks for business owners. Your inputs stay in your browser and are not saved." />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
        <Tabs defaultValue="gst">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1.5">
            <TabsTrigger value="gst"><Calculator className="h-4 w-4" /> GST</TabsTrigger>
            <TabsTrigger value="break-even"><CircleDollarSign className="h-4 w-4" /> Break-even</TabsTrigger>
            <TabsTrigger value="working-capital"><WalletCards className="h-4 w-4" /> Working capital</TabsTrigger>
            <TabsTrigger value="receivables"><TimerReset className="h-4 w-4" /> Receivables</TabsTrigger>
            <TabsTrigger value="bookkeeping"><ClipboardCheck className="h-4 w-4" /> Bookkeeping</TabsTrigger>
          </TabsList>

          <TabsContent value="gst"><ToolFrame title="GST calculator" intro="Estimate GST on a taxable amount. Confirm the applicable rate and tax treatment for your transaction before filing." result={<div className="space-y-4"><Result label="GST amount" value={money.format(gst)} note={`At ${num(gstRate)}% on ${money.format(num(gstBase))}.`} /><Result label="Invoice total" value={money.format(num(gstBase) + gst)} note="Taxable value plus estimated GST." /></div>}><Field id="gst-base" label="Taxable amount (₹)" value={gstBase} onChange={setGstBase} /><div><Label htmlFor="gst-rate">GST rate (%)</Label><select id="gst-rate" value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option>0</option><option>5</option><option>12</option><option>18</option><option>28</option></select></div></ToolFrame></TabsContent>

          <TabsContent value="break-even"><ToolFrame title="Break-even calculator" intro="Estimate the sales volume needed to cover fixed costs based on contribution per unit." result={<div className="space-y-4"><Result label="Contribution per unit" value={money.format(Math.max(contribution, 0))} note="Selling price less variable cost." /><Result label="Break-even volume" value={contribution > 0 ? `${Math.ceil(breakEven).toLocaleString("en-IN")} units` : "—"} note={contribution > 0 ? `Equivalent to approximately ${money.format(Math.ceil(breakEven) * num(price))} in sales.` : "Selling price must be higher than variable cost."} /></div>}><Field id="fixed" label="Monthly fixed costs (₹)" value={fixed} onChange={setFixed} /><Field id="price" label="Selling price per unit (₹)" value={price} onChange={setPrice} /><Field id="variable" label="Variable cost per unit (₹)" value={variable} onChange={setVariable} /></ToolFrame></TabsContent>

          <TabsContent value="working-capital"><ToolFrame title="Working-capital calculator" intro="Compare short-term assets and liabilities to understand your operating liquidity position." result={<div className="space-y-4"><Result label="Net working capital" value={money.format(workingCapital)} note={workingCapital >= 0 ? "A positive position, before considering timing and asset quality." : "A negative position deserves closer cash-flow planning."} /><Result label="Current ratio" value={num(liabilities) > 0 ? `${(num(assets) / num(liabilities)).toFixed(2)}×` : "—"} note="Current assets divided by current liabilities." /></div>}><Field id="assets" label="Current assets (₹)" value={assets} onChange={setAssets} /><Field id="liabilities" label="Current liabilities (₹)" value={liabilities} onChange={setLiabilities} /></ToolFrame></TabsContent>

          <TabsContent value="receivables"><ToolFrame title="Receivables health check" intro="Use overdue share and debtor days as a first signal of collection pressure." result={<div className="space-y-4"><Result label="Overdue share" value={`${overdueShare.toFixed(1)}%`} note={overdueShare <= 15 ? "Relatively contained, subject to customer concentration." : overdueShare <= 30 ? "Worth a structured follow-up review." : "A high overdue share may be restricting cash flow."} /><Result label="Estimated debtor days" value={`${Math.round(debtorDays)} days`} note="Based on annual credit sales and closing receivables." /></div>}><Field id="receivables" label="Total receivables (₹)" value={receivables} onChange={setReceivables} /><Field id="overdue" label="Overdue receivables (₹)" value={overdue} onChange={setOverdue} /><Field id="sales" label="Annual credit sales (₹)" value={sales} onChange={setSales} /></ToolFrame></TabsContent>

          <TabsContent value="bookkeeping"><ToolFrame title="Bookkeeping-readiness checklist" intro="Check the routines that support dependable monthly accounts." result={<div className="space-y-4"><Result label="Readiness score" value={`${readiness}%`} note={readiness >= 75 ? "A solid base. Review any unchecked areas before the next close." : readiness >= 50 ? "Some structure exists, but gaps can still affect reporting." : "The bookkeeping process needs a more consistent monthly routine."} /><Button variant="outline" onClick={() => setChecked([])}><RotateCcw className="mr-2 h-4 w-4" /> Reset checklist</Button></div>}><div className="sm:col-span-2 space-y-3">{checklist.map((item, index) => <label key={item} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 text-sm"><Checkbox checked={checked.includes(index)} onCheckedChange={(value) => setChecked((current) => value ? [...current, index] : current.filter((i) => i !== index))} aria-label={item} /><span>{item}</span></label>)}</div></ToolFrame></TabsContent>
        </Tabs>

        <div className="mt-10 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">These tools provide general estimates and self-assessment only. They are not tax, accounting, investment or legal advice.</div>
        <div className="mt-14 surface-navy rounded-xl px-7 py-10 sm:flex sm:items-center sm:justify-between sm:gap-8"><div><h2 className="font-display text-2xl font-semibold">Need help interpreting the result?</h2><p className="mt-2 text-sm opacity-75">Bring the real numbers to a free consultation.</p></div><Button asChild variant="secondary" size="lg" className="mt-6 rounded-full sm:mt-0"><Link to="/contact" hash="book">Book a Free Consultation <ArrowRight className="ml-1 h-4 w-4" /></Link></Button></div>
      </section>
    </>
  );
}