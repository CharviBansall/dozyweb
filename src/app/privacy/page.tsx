import Link from "next/link";
import type { ReactNode } from "react";
import { ApplePage, displaySerif } from "@/components/apple/apple-ui";

export const metadata = {
  title: "Privacy Policy · Dozy",
  description:
    "What data Dozy uses, where it goes, and how to delete your account.",
  alternates: { canonical: "https://www.appdozy.com/privacy" },
};

const CONTACT_EMAIL = "charvibansal2006@gmail.com";

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="mt-14 text-[28px] font-light leading-tight tracking-[-0.01em] text-[var(--dozy-ink)]"
      style={{ fontFamily: displaySerif }}
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-[17px] leading-relaxed text-[var(--dozy-muted)]">
      {children}
    </p>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-3 pl-6 text-[17px] leading-relaxed text-[var(--dozy-muted)]">
      {children}
    </ul>
  );
}

function B({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-[var(--dozy-ink)]">{children}</strong>
  );
}

// Keep in step with index.md in the app repository.
export default function PrivacyPage() {
  return (
    <ApplePage>
      <main className="mx-auto max-w-[720px] px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-[14px] text-[var(--dozy-muted)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Dozy
          </Link>
        </p>
        <h1
          className="mt-4 text-[clamp(2.5rem,8vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-[var(--dozy-ink)]"
          style={{ fontFamily: displaySerif }}
        >
          Privacy Policy
        </h1>
        <p className="mt-4 text-[14px] text-[var(--dozy-muted)]">
          Last updated: November 17, 2026
        </p>

        <P>
          Dozy (&ldquo;the app,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) turns
          your sleep data into a daily plan: how much sleep you owe, and the one
          thing to do about it today. This policy explains what data Dozy uses,
          where it goes, and the choices you have.
        </P>

        <H2>The short version</H2>
        <List>
          <li>
            Sleep data from <B>Apple Health stays on your device</B>. Dozy never
            uploads it.
          </li>
          <li>
            Signing in sends a sign-in token from Apple or Google to our server,
            so we can confirm it is you. We do not keep a database of accounts.
          </li>
          <li>
            If you choose to connect <B>Oura, Garmin or Whoop</B>, your sleep summaries
            from that tracker pass through our server and our data partner,
            Junction.
          </li>
          <li>
            We do not sell your data, show ads, or use analytics or tracking
            SDKs.
          </li>
          <li>
            You can delete your account in the app at any time:{" "}
            <B>You → Delete Account</B>.
          </li>
        </List>

        <H2>Apple Health data</H2>
        <P>
          With your permission, Dozy reads <B>Sleep Analysis</B> from Apple
          Health: your recorded sleep sessions and sleep stages (core, deep,
          REM). Dozy uses it to work out your sleep need, your sleep debt,
          tonight&rsquo;s bedtime, and whether a nap is worth taking.
        </P>
        <P>
          With your permission, Dozy also writes to Apple Health: when you
          finish a nap with Dozy&rsquo;s nap timer, the nap is saved as sleep so
          it counts toward your debt. Dozy only writes naps you start and
          complete in the app.
        </P>
        <P>
          All of these calculations happen <B>on your device</B>. Apple Health
          data is not sent to our server or to anyone else, and is never used
          for advertising. If you use iCloud for Health, Apple syncs that data
          between your own devices under Apple&rsquo;s control.
        </P>
        <P>
          You can change Dozy&rsquo;s access at any time in Settings → Health →
          Data Access &amp; Devices → Dozy, and you can review or delete the
          naps Dozy wrote in the Health app.
        </P>

        <H2>Your account</H2>
        <P>Dozy asks you to sign in with Apple or with Google.</P>
        <List>
          <li>
            <B>What is sent to us.</B> The app sends the sign-in token issued by
            Apple or Google to our server at appdozy.com. The server checks the
            token and returns a session that lasts about 90 days. The token
            contains an account identifier and may contain your email address.
          </li>
          <li>
            <B>What we keep.</B> We do not store your name, email address, or
            the token. The server keeps no list of accounts; the session is held
            on your phone, in the iOS Keychain.
          </li>
          <li>
            <B>What stays on your phone.</B> Your name and email, if Apple or
            Google share them, are stored only on your device so the app can
            show them to you.
          </li>
        </List>
        <P>
          Apple and Google each process the sign-in under their own privacy
          policies.
        </P>

        <H2>Oura, Garmin and Whoop (optional)</H2>
        <P>
          You can use Dozy with Apple Health alone. If you choose to connect an
          Oura, Garmin or Whoop account in <B>You → Sleep Sources</B>:
        </P>
        <List>
          <li>
            You sign in to that service through <B>Junction</B> (Junction
            Technologies, formerly Vital), a health-data provider we use to
            connect trackers.
          </li>
          <li>
            Junction retrieves your <B>sleep summaries</B> from that service:
            dates, bed and wake times, and time in each sleep stage. It stores
            them on our behalf.
          </li>
          <li>
            Our server requests those summaries from Junction and passes them to
            the app on your phone. The server stores the identifier that links
            your Dozy account to Junction, and nothing else about your sleep.
          </li>
        </List>
        <P>
          We use this data only to calculate your plan. It is not sold, shared
          for advertising, or used to train models.
        </P>

        <H2>Other services we rely on</H2>
        <List>
          <li>
            <B>Vercel</B> hosts our website and server. Like any web host, it
            logs technical details of requests, such as IP address and time.
          </li>
          <li>
            <B>Stripe</B> processes payments if you buy a subscription on our
            website. We never see your full card number. Purchases made inside
            the iPhone app, when available, are handled by Apple.
          </li>
        </List>
        <P>Dozy contains no advertising and no third-party analytics.</P>

        <H2>Notifications</H2>
        <P>
          If you turn them on, nap alarms and the morning summary are created by
          the app on your device. Their content is not sent to us.
        </P>

        <H2>Keeping and deleting your data</H2>
        <List>
          <li>
            <B>Delete your account</B> in the app under You → Delete Account.
            This signs you out, clears Dozy&rsquo;s data from your phone,
            disconnects any Oura, Garmin or Whoop account, and tells Junction to delete
            the sleep data it holds for you. Junction disconnects trackers
            immediately and erases the data within about seven days.
          </li>
          <li>
            <B>Sign out</B> removes your session from the phone. A connected
            tracker stays linked on our side until you delete your account.
          </li>
          <li>
            Sleep data in Apple Health belongs to you and is not affected. You
            can remove it in the Health app.
          </li>
          <li>
            You can also email us to ask for deletion, or to ask what we hold
            about you.
          </li>
        </List>

        <H2>Children</H2>
        <P>
          Dozy is not directed at children under 13 and does not knowingly
          collect personal information from them.
        </P>

        <H2>Changes to this policy</H2>
        <P>
          We may update this policy as the app changes. Updates are posted here
          with a new date.
        </P>

        <H2>Contact</H2>
        <P>
          Questions about this policy or your data: <B>Charvi Bansal</B>,{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline underline-offset-4 hover:text-[var(--dozy-ink)]"
          >
            {CONTACT_EMAIL}
          </a>
        </P>
      </main>
    </ApplePage>
  );
}
