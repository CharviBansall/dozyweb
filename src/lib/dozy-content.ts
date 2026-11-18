export const HIGHLIGHTS = [
  {
    step: "1",
    title: "Sleep Debt",
    body: "What you owe over the last two weeks, in plain numbers. Short nights add to it; longer nights and naps pay it back.",
    ring: "#ff3b30", // heart red
    progress: 0.7,
  },
  {
    step: "2",
    title: "Today\u2019s One Thing",
    body: "A nap between 1:00 and 3:30 PM, or a bedtime worked back from your wake time. One clear step instead of a dashboard.",
    ring: "#1a9bb0", // teal
    progress: 0.45,
  },
  {
    step: "3",
    title: "Deep + REM",
    body: "How much of last night was the restorative kind, measured against a 40% goal, next to your sleeping heart rate, HRV, and breathing.",
    ring: "#7a5cf0", // violet
    progress: 0.73,
  },
] as const;

export const NAP_TYPES = [
  { name: "Power nap", duration: "20 min", color: "hsl(210, 80%, 60%)" },
  { name: "Extended", duration: "30 min", color: "hsl(235, 60%, 40%)" },
  { name: "Full cycle", duration: "90 min", color: "hsl(230, 85%, 73%)" },
  { name: "Circadian", duration: "Smart", color: "hsl(210, 50%, 50%)" },
  { name: "Debt recovery", duration: "Adaptive", color: "hsl(235, 45%, 55%)" },
  { name: "Window alert", duration: "Notify", color: "hsl(230, 60%, 65%)" },
] as const;

export const FAQ = [
  {
    q: "Where can I find Dozy?",
    a: "Dozy lives on your iPhone. Connect Apple Health once, and the Today tab shows your sleep debt, the one thing to do about it, and last night’s deep and REM sleep.",
  },
  {
    q: "Do I need an Apple Watch?",
    a: "No. Dozy works with iPhone and Apple Health alone. With Apple Watch, you can start naps from your wrist and feel a gentle tap when it’s time to wake.",
  },
  {
    q: "What Health data does Dozy use?",
    a: "Dozy reads sleep analysis from Apple Health — stages, duration, and timing — to calculate your sleep debt and today’s plan. It also reads your overnight heart rate, heart rate variability, and breathing rate to show alongside your deep and REM sleep.",
  },
  {
    q: "How are nap lengths chosen?",
    a: "Dozy weighs how much rest you owe and the time of day, favoring short, effective naps that help you catch up without wrecking tonight’s sleep.",
  },
  {
    q: "Will Dozy wake me up?",
    a: "Yes. Start a nap and Dozy counts down, then wakes you with a gentle tap — no jarring alarm — and credits the rest toward your sleep debt.",
  },
  {
    q: "How much does Dozy cost?",
    a: "Dozy is free. There is no subscription and nothing to buy in the app.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Every calculation happens on your device, and Apple Health data never leaves it. If you choose to connect Oura or Garmin, only that tracker’s sleep summaries pass through our server. No ads, no analytics on your health, nothing to sell.",
  },
] as const;

export const DEVICES = ["iPhone", "Apple Watch"] as const;

export const APP_STORE_URL =
  "https://apps.apple.com/us/app/dozy-sleep/id6779768698";
