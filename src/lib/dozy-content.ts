export const HIGHLIGHTS = [
  {
    step: "1",
    title: "Sleep Debt",
    body: "Your accumulated shortfall over the last two weeks, in plain numbers. Tap any day to see exactly how you slept.",
    ring: "#ff3b30", // red
    progress: 0.7,
  },
  {
    step: "2",
    title: "Nap",
    body: "A personalized nap length based on how much rest you owe — grounded in sleep science that favors short, effective naps.",
    ring: "#0a84ff", // blue
    progress: 0.45,
  },
  {
    step: "3",
    title: "Restore",
    body: "Finish a nap and Dozy logs it back to Apple Health, crediting your recovery so your sleep debt actually goes down.",
    ring: "#ffcc00", // orange
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
    a: "Dozy lives on your iPhone. Connect Apple Health once, and your Home tab shows your sleep debt, today’s nap window, and last night’s restorative sleep.",
  },
  {
    q: "Do I need an Apple Watch?",
    a: "No. Dozy works with iPhone and Apple Health alone. With Apple Watch, you can start naps from your wrist and feel a gentle tap when it’s time to wake.",
  },
  {
    q: "What Health data does Dozy use?",
    a: "Dozy reads sleep analysis from Apple Health — stages, duration, and timing — to calculate your sleep debt and the right nap to recover.",
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
    q: "Is my data private?",
    a: "Yes. Every calculation happens on your device. Your health data never leaves it for us — no ads, no analytics on your health, nothing to sell.",
  },
] as const;

export const DEVICES = ["iPhone", "Apple Watch"] as const;

export const APP_STORE_URL =
  "https://apps.apple.com/us/app/dozy-sleep/id6779768698";
