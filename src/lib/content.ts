export const BRAND = {
  name: "Sarvagya Consultancy",
  founder: "CMA Siddhanth Bothra",
  email: "sarvagyaconsultancy@gmail.com",
  instagram: "sarvagyaconsultancy",
  instagramUrl: "https://www.instagram.com/sarvagyaconsultancy/",
  city: "Chennai, India",
  tagline: "Virtual. Reliable. Growth Focused.",
} as const;

export type ServiceItem = {
  slug: string;
  title: string;
  what: string;
  who: string;
  how: string;
};

export type ServiceCategory = {
  slug: string;
  title: string;
  blurb: string;
  items: ServiceItem[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "accounting-bookkeeping",
    title: "Accounting & Bookkeeping",
    blurb: "Books that are current, accurate and actually readable.",
    items: [
      {
        slug: "bookkeeping",
        title: "Bookkeeping",
        what: "Day-to-day recording of sales, purchases, expenses, banking and ledgers.",
        who: "Businesses whose entries are pending, informal or spread across spreadsheets.",
        how: "We set a recording routine, close each period on time and keep ledgers reconciled.",
      },
      {
        slug: "accounting",
        title: "Accounting",
        what: "Structured accounts with proper classification, provisions and period closing.",
        who: "Owners who need statements they can rely on, not just data entry.",
        how: "We build a chart of accounts suited to your business and close books to a schedule.",
      },
      {
        slug: "payroll",
        title: "Payroll",
        what: "Salary processing, statutory deductions and payroll records.",
        who: "Businesses with a growing team and manual salary workings.",
        how: "We standardise payroll inputs, run the cycle and keep the supporting records in order.",
      },
      {
        slug: "financial-reporting",
        title: "Financial reporting",
        what: "Profit and loss, balance sheet and cash position prepared periodically.",
        who: "Owners who only see numbers once a year.",
        how: "We prepare reports at a regular cadence and walk you through what changed.",
      },
      {
        slug: "mis",
        title: "MIS reporting",
        what: "Management reports built around the decisions you actually make.",
        who: "Owners whose reports look correct but say nothing useful.",
        how: "We design an MIS pack around your products, branches, margins and costs.",
      },
      {
        slug: "accounting-review",
        title: "Accounting review & rectification",
        what: "Review of existing books and correction of past errors.",
        who: "Businesses with incomplete, duplicated or mismatched history.",
        how: "We trace the gaps, rectify entries and restate the position cleanly.",
      },
    ],
  },
  {
    slug: "tax-gst",
    title: "Tax & GST",
    blurb: "Compliance handled, notices answered, exposure understood.",
    items: [
      {
        slug: "gst-services",
        title: "GST services",
        what: "Registration support, periodic returns, reconciliations and input credit review.",
        who: "Any registered business that wants filings done accurately and on time.",
        how: "We reconcile returns with books and credit statements before filing, not after.",
      },
      {
        slug: "tax-compliance",
        title: "Tax compliance",
        what: "Ongoing direct and indirect tax compliance calendar and filings.",
        who: "Businesses tracking due dates informally.",
        how: "We run a compliance calendar and keep documentation ready.",
      },
      {
        slug: "gst-notices",
        title: "GST notices",
        what: "Review of the notice, the underlying data and the exposure it creates.",
        who: "Businesses that have received a notice and are unsure what it means.",
        how: "We interpret the notice, assemble evidence and explain the options in plain terms.",
      },
      {
        slug: "gst-order-replies",
        title: "GST order replies",
        what: "Drafting and filing of replies to orders with supporting reconciliations.",
        who: "Businesses facing an order with a response deadline.",
        how: "We prepare a reasoned reply supported by the records.",
      },
      {
        slug: "gst-settlement",
        title: "Notice & order settlement support",
        what: "Support through the settlement or closure of notices and orders.",
        who: "Businesses wanting a matter closed properly rather than left open.",
        how: "We coordinate the workings, submissions and follow-through.",
      },
      {
        slug: "tax-support",
        title: "Tax-related support",
        what: "Working-level support on tax positions, documentation and queries.",
        who: "Owners who need a considered answer before deciding.",
        how: "We look at the facts and give you a practical position.",
      },
    ],
  },
  {
    slug: "financial-management",
    title: "Financial Management",
    blurb: "The finance function of a larger company, sized to yours.",
    items: [
      {
        slug: "virtual-cfo",
        title: "Virtual CFO",
        what: "Senior finance oversight without a full-time hire.",
        who: "Growing businesses that need financial direction, not just processing.",
        how: "We take ownership of reporting, controls, cash and financial decisions with you.",
      },
      {
        slug: "financial-planning",
        title: "Financial planning",
        what: "Budgets, forecasts and planning tied to your operating reality.",
        who: "Businesses planning growth, hiring or investment.",
        how: "We build a plan you can track monthly against actuals.",
      },
      {
        slug: "financial-analysis",
        title: "Financial analysis",
        what: "Margin, cost and profitability analysis across products, clients or units.",
        who: "Owners who know revenue but not where profit is made or lost.",
        how: "We break the numbers down to where the decisions sit.",
      },
      {
        slug: "management-reporting",
        title: "Management reporting",
        what: "A reporting pack for owners and management, reviewed together.",
        who: "Businesses whose reporting stops at compliance.",
        how: "We report the few numbers that change your decisions.",
      },
      {
        slug: "cash-flow",
        title: "Cash-flow management",
        what: "Visibility and control over inflows, outflows and working capital.",
        who: "Profitable businesses that still feel short of cash.",
        how: "We build a cash view, tighten collections and plan payments.",
      },
      {
        slug: "financial-strategy",
        title: "Business financial strategy",
        what: "Financial structure, pricing inputs and capital decisions.",
        who: "Owners at a turning point in the business.",
        how: "We work through the options with the numbers on the table.",
      },
    ],
  },
  {
    slug: "business-resolution",
    title: "Business Resolution",
    blurb: "Recovering what is owed and closing what is open.",
    items: [
      {
        slug: "debtors-recovery",
        title: "Debtors recovery",
        what: "Structured follow-up and recovery of outstanding receivables.",
        who: "Businesses with ageing debtors and no recovery process.",
        how: "We age the book, prioritise, and run a disciplined recovery process.",
      },
      {
        slug: "litigation-support",
        title: "Litigation support",
        what: "Financial workings, records and reconciliations for legal matters.",
        who: "Businesses in a dispute needing sound financial support.",
        how: "We assemble the numbers and documentation your counsel needs.",
      },
      {
        slug: "financial-disputes",
        title: "Financial dispute support",
        what: "Reconstruction and reconciliation of disputed accounts.",
        who: "Businesses in disagreement with a customer, supplier or partner.",
        how: "We establish what the records actually show.",
      },
      {
        slug: "notice-response",
        title: "Notice & order response",
        what: "End-to-end handling of responses and follow-through to closure.",
        who: "Businesses with open departmental matters.",
        how: "We manage the response process to a definite conclusion.",
      },
    ],
  },
  {
    slug: "business-growth",
    title: "Business Growth",
    blurb: "Funding and structure for the next stage.",
    items: [
      {
        slug: "fund-raising",
        title: "Fund raising",
        what: "Preparation of financials, projections and documentation for funding.",
        who: "Businesses seeking capital for growth or working capital.",
        how: "We get the numbers presentation-ready and support the process.",
      },
      {
        slug: "funding-options",
        title: "Multiple funding options",
        what: "Review of the funding routes realistically open to your business.",
        who: "Owners unsure which route fits their scale and stage.",
        how: "We compare the options on cost, control and feasibility.",
      },
      {
        slug: "business-finance",
        title: "Business finance support",
        what: "Support on facilities, limits and lender documentation.",
        who: "Businesses working with banks or financiers.",
        how: "We prepare the workings and keep the file complete.",
      },
      {
        slug: "business-structuring",
        title: "Business structuring",
        what: "Entity, process and reporting structure suited to your scale.",
        who: "Businesses that have outgrown how they were originally set up.",
        how: "We recommend structure that adds discipline without adding friction.",
      },
    ],
  },
];

export const HOME_CATEGORIES = [
  {
    title: "Accounting & Bookkeeping",
    line: "Books that are current, accurate and readable.",
    href: "/services",
  },
  { title: "Tax & GST", line: "Filings on time. Notices answered properly.", href: "/services" },
  {
    title: "Financial Management",
    line: "Virtual CFO, cash flow and reporting that guides decisions.",
    href: "/services",
  },
  {
    title: "Business Growth & Resolution",
    line: "Recovery, funding and structure for the next stage.",
    href: "/services",
  },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "What businesses does Sarvagya work with?",
    a: "We work with owner-run and growing Indian businesses across trading, manufacturing and services. The common thread is a business that has outgrown informal financial handling.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Yes. Scale is not the qualifier — intent is. If you want your finances structured properly, the size of the business is something we work around.",
  },
  {
    q: "Do you work with startups?",
    a: "Yes. Early-stage businesses benefit most from getting the structure right before habits set in.",
  },
  {
    q: "Can you work with businesses outside Chennai?",
    a: "Yes. We are based in Chennai and work with businesses across India on a virtual basis.",
  },
  {
    q: "Do you serve international clients?",
    a: "We primarily serve Indian businesses and are open to international engagements where we can add genuine value.",
  },
  {
    q: "What is the difference between bookkeeping and accounting?",
    a: "Bookkeeping records what happened. Accounting organises, classifies and closes those records so they produce statements you can rely on and act upon.",
  },
  {
    q: "Can Sarvagya work with our existing accountant?",
    a: "Yes, and it is common. We often work alongside an in-house accountant — setting the process, reviewing the output and defining what work should be coming from that role.",
  },
  {
    q: "Can Sarvagya help rectify old books?",
    a: "Yes. We review existing books, identify the gaps and errors, and rectify them so your current position is stated correctly.",
  },
  {
    q: "Can you help with GST notices?",
    a: "Yes. We review the notice and the underlying data, explain the exposure, and prepare and file the reply with supporting reconciliations.",
  },
  {
    q: "Can you assist with debtors recovery?",
    a: "Yes. We age the receivables, prioritise them and run a structured recovery follow-up rather than ad hoc reminders.",
  },
  {
    q: "Do you provide Virtual CFO services?",
    a: "Yes. Virtual CFO gives you senior finance oversight — reporting, controls, cash and financial decision support — without a full-time hire.",
  },
  {
    q: "Can Sarvagya help businesses raise funds?",
    a: "We prepare the financials, projections and documentation required, review the funding routes realistically open to you, and support you through the process.",
  },
  {
    q: "How does the Sarvagya Business Health Check work?",
    a: "It is a human-led review conducted by the founder and team after understanding your business. It is not the automated Quick Test on this website. It begins with a free consultation.",
  },
  {
    q: "How much do your services cost?",
    a: "Sarvagya's pricing depends on the business's requirements, location and scale. A quote is provided after understanding the business and its requirements.",
  },
  {
    q: "How do I start working with Sarvagya?",
    a: "Book a free consultation. We understand your business and current position, and tell you plainly what we think should happen next.",
  },
];

export type QuickTestQuestion = {
  id: string;
  question: string;
  hint: string;
};

export const QUICK_TEST_QUESTIONS: QuickTestQuestion[] = [
  {
    id: "books",
    question: "Are your books updated regularly?",
    hint: "Entries closed each month, not caught up at year end.",
  },
  {
    id: "profitability",
    question: "Do you know your monthly profitability?",
    hint: "Not just turnover — what actually remained.",
  },
  {
    id: "receivables",
    question: "Do you have clear visibility over receivables?",
    hint: "Who owes what, and for how long.",
  },
  {
    id: "accountant",
    question: "Do you know what your accountant is working on?",
    hint: "And what work you should be getting from that role.",
  },
  {
    id: "reports",
    question: "Do you review financial reports regularly?",
    hint: "A set cadence, not only when something goes wrong.",
  },
  {
    id: "compliance",
    question: "Do you have visibility over GST and tax compliance?",
    hint: "Filings, due dates and any open notices.",
  },
  {
    id: "decisions",
    question: "Can you make financial decisions confidently from your current reports?",
    hint: "Pricing, hiring, spending, expansion.",
  },
];

export const ANSWER_OPTIONS = [
  { value: 0, label: "No" },
  { value: 1, label: "Somewhat" },
  { value: 2, label: "Yes" },
] as const;

export function bandForScore(score: number, max: number) {
  const pct = max === 0 ? 0 : (score / max) * 100;
  if (pct < 45) return "Needs Attention";
  if (pct < 75) return "Fairly Organized";
  return "Well Organized";
}

export const BAND_COPY: Record<string, { headline: string; body: string }> = {
  "Needs Attention": {
    headline: "There are areas here that deserve a closer look.",
    body: "Several parts of your financial routine appear to be running informally. That is common in growing businesses — and it is usually fixable with structure rather than effort.",
  },
  "Fairly Organized": {
    headline: "A reasonable base, with visible gaps.",
    body: "The fundamentals seem to be in place, but some areas are likely running on memory rather than process. Those are usually the areas that cost time and money quietly.",
  },
  "Well Organized": {
    headline: "Your finances appear well handled.",
    body: "Most areas look structured. The next step for businesses at this stage is usually sharper reporting and financial decision support rather than clean-up.",
  },
};
