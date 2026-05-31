export const HIGHLIGHTS = [
  {
    title: "3 nap types, from Power to Full Cycle.",
    body: "Recommendations adapt to your sleep debt, circadian rhythm, and how much time you have — from 20 to 90 minutes.",
  },
  {
    title: "Personalized nap windows.",
    body: "Dozy analyzes 14 days of Apple Health sleep data and surfaces the best time to rest before you hit the afternoon crash.",
  },
  {
    title: "Real-time metrics from Apple Watch.",
    body: "Track your active nap on iPhone and Watch. See time remaining, sleep debt context, and when your window closes.",
  },
  {
    title: "Gentle wake alarms.",
    body: "Local notifications and haptics wake you at the right moment — without grogginess from oversleeping.",
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
    a: "Dozy lives on your iPhone. Connect Apple Health once, and your Home tab shows today’s recommendation, nap window, and sleep trends.",
  },
  {
    q: "Do I need an Apple Watch?",
    a: "No. Dozy works with iPhone and Apple Health alone. With Apple Watch, you can start naps from your wrist and feel haptic wake cues.",
  },
  {
    q: "What Health data does Dozy use?",
    a: "Dozy reads sleep analysis from Apple Health — stages, duration, and timing — to estimate sleep debt and circadian nap windows.",
  },
  {
    q: "How are nap lengths chosen?",
    a: "The recommendation engine weighs sleep debt, time of day, and your recent sleep trends to suggest power, extended, or full-cycle naps.",
  },
  {
    q: "Will Dozy wake me up?",
    a: "Yes. Start a nap in Dozy and you’ll get a local notification at the end of your session. Allow notifications for reliable alarms.",
  },
] as const;

export const DEVICES = ["iPhone", "Apple Watch"] as const;
