export type CaseStudySection = {
  id: string;
  phase: string;
  headline: string;
  body: string;
  imageLabel: string;
};

export const DOZY_CASE_STUDY = {
  hero: {
    title: "Helping students recover sleep without guessing when to nap",
    subtitle:
      "Inspired by Apple Health, Oura, and WHOOP, Dozy turns sleep history into personalized nap recommendations.",
  },
  meta: {
    role: "Founder, Product Designer, iOS Developer",
    timeline: "2026",
    focus: "User Research, Information Architecture, Product Design, User Testing, iOS Development",
  },
  sections: [
    {
      id: "problem",
      phase: "Problem",
      headline: "Students know they're tired — but not when, or for how long, to nap",
      body:
        "College sleep is irregular. Students pull all-nighters, nap between classes, and still wake up groggy — but most tools only show last night's sleep score. They don't answer the question that matters: how much rest do you owe yourself, and what's the right nap to catch up without ruining tonight?",
      imageLabel: "Problem framing — student sleep patterns & pain points",
    },
    {
      id: "research",
      phase: "Research",
      headline:
        "I studied how students actually nap — between lectures, after late nights, and before exams",
      body:
        "I interviewed students who already tracked sleep on Apple Watch or iPhone but still felt lost. Many napped by guesswork: 20 minutes when tired, 90 when exhausted. The pattern wasn't lack of data — it was lack of guidance tied to their actual sleep shortfall over time.",
      imageLabel: "Research synthesis — interview notes & journey maps",
    },
    {
      id: "insights",
      phase: "Insights",
      headline:
        "The hard part isn't tracking sleep — it's knowing what to do with the data",
      body:
        "Three ideas kept surfacing: students wanted a single number for sleep debt, a nap recommendation grounded in science (not vibes), and proof that a nap actually moved the needle. They didn't want another dashboard — they wanted a decision.",
      imageLabel: "Key insights — affinity map & design principles",
    },
    {
      id: "exploration",
      phase: "Exploration",
      headline:
        "I explored how sleep debt, nap windows, and recovery could live in one calm daily view",
      body:
        "Early explorations ranged from dense analytics to minimal rings. I leaned toward an Apple Health–inspired summary: three signals (debt, nap window, restorative sleep) that you could understand in seconds and act on without opening a spreadsheet.",
      imageLabel: "Design exploration — wireframes & visual directions",
    },
    {
      id: "testing",
      phase: "Testing",
      headline:
        "Testing showed students would take a nap — if the length felt specific, not generic",
      body:
        "In prototype testing, generic \"take a 20 min nap\" prompts were ignored. Personalized lengths based on accumulated debt performed better — especially when paired with a clear time window and a gentle watch tap at wake-up.",
      imageLabel: "User testing — prototype screens & feedback themes",
    },
    {
      id: "solution",
      phase: "Final Solution",
      headline:
        "Dozy turns two weeks of sleep history into one clear nap recommendation",
      body:
        "The final product reads Apple Health sleep data on-device, calculates rolling sleep debt, surfaces a nap window for the day, and credits recovery back to Health when you finish. No accounts, no uploads — just a nap plan that respects how students actually live.",
      imageLabel: "Final UI — summary, sleep debt, nap window & restorative sleep",
    },
    {
      id: "reflection",
      phase: "Reflection",
      headline:
        "Designing for recovery meant resisting the urge to show everything at once",
      body:
        "The biggest lesson: health products earn trust through restraint. Every feature I cut made the core loop clearer — see what you owe, nap at the right time, watch your debt go down. Dozy is still evolving, but the north star hasn't changed: help students recover without guessing.",
      imageLabel: "Reflection — next steps & learnings",
    },
  ] satisfies CaseStudySection[],
} as const;

export const DOZY_PROJECT_CARD = {
  title: "Dozy",
  subtitle: "Personalized nap planning from sleep history",
  label: "PRODUCT DESIGN · IOS · HEALTH",
  href: "/dozy",
} as const;
