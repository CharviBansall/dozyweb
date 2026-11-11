/**
 * Thin Junction (Vital) REST client for Dozy sleep sources.
 * Docs: https://docs.junction.com/
 */

export type JunctionEnvironment = "sandbox" | "production";

export type JunctionProviderSlug = "oura" | "garmin" | "whoop_v2" | "whoop";

const SANDBOX_BASE = "https://api.sandbox.us.junction.com";
const PRODUCTION_BASE = "https://api.us.junction.com";

export function getJunctionApiKey(): string {
  const key = process.env.JUNCTION_API_KEY;
  if (!key) {
    throw new Error("JUNCTION_API_KEY is not set");
  }
  return key;
}

export function getJunctionBaseUrl(): string {
  const env = (process.env.JUNCTION_ENVIRONMENT || "sandbox").toLowerCase();
  if (env === "production" || env === "prod") return PRODUCTION_BASE;
  return SANDBOX_BASE;
}

async function junctionFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${getJunctionBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-vital-api-key": getJunctionApiKey(),
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  if (!response.ok) {
    const err = new Error(
      `Junction ${init.method || "GET"} ${path} failed (${response.status})`,
    );
    (err as Error & { status: number; body: unknown }).status = response.status;
    (err as Error & { status: number; body: unknown }).body = body;
    throw err;
  }

  return body as T;
}

export type JunctionUser = {
  user_id: string;
  client_user_id: string;
  team_id: string;
  connected_sources?: Array<{
    created_on: string;
    provider?: { name: string; slug: string };
    source?: { name: string; slug: string };
  }>;
};

export type JunctionLinkToken = {
  link_token?: string;
  linkToken?: string;
  link_web_url?: string;
  linkWebUrl?: string;
};

export type JunctionSleepSummary = {
  id: string;
  user_id: string;
  calendar_date?: string;
  bedtime_start?: string;
  bedtime_stop?: string;
  duration?: number;
  total?: number;
  awake?: number;
  light?: number;
  deep?: number;
  rem?: number;
  stage_asleep_second?: number | null;
  stage_awake_second?: number | null;
  stage_light_second?: number | null;
  stage_deep_second?: number | null;
  stage_rem_second?: number | null;
  source?: { provider?: string; type?: string };
};

/** Create a Junction user, or return the existing one on client_user_id conflict. */
export async function ensureJunctionUser(
  clientUserId: string,
): Promise<JunctionUser> {
  try {
    return await junctionFetch<JunctionUser>("/v2/user/", {
      method: "POST",
      body: JSON.stringify({
        client_user_id: clientUserId,
        fallback_time_zone: "America/New_York",
      }),
    });
  } catch (error) {
    const e = error as Error & {
      status?: number;
      body?: { detail?: { user_id?: string; created_on?: string } };
    };
    if (e.status === 400 && e.body?.detail?.user_id) {
      return junctionFetch<JunctionUser>(`/v2/user/${e.body.detail.user_id}`);
    }
    throw error;
  }
}

export async function createLinkToken(options: {
  userId: string;
  provider?: JunctionProviderSlug;
  redirectUrl?: string;
  filterOnProviders?: JunctionProviderSlug[];
}): Promise<JunctionLinkToken> {
  const payload: Record<string, unknown> = {
    user_id: options.userId,
  };
  if (options.provider) payload.provider = options.provider;
  if (options.redirectUrl) payload.redirect_url = options.redirectUrl;
  if (options.filterOnProviders?.length) {
    payload.filter_on_providers = options.filterOnProviders;
  }

  return junctionFetch<JunctionLinkToken>("/v2/link/token", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSleepSummaries(options: {
  userId: string;
  startDate: string;
  endDate?: string;
  provider?: string;
}): Promise<{ sleep: JunctionSleepSummary[] }> {
  const params = new URLSearchParams({ start_date: options.startDate });
  if (options.endDate) params.set("end_date", options.endDate);
  if (options.provider) params.set("provider", options.provider);

  return junctionFetch<{ sleep: JunctionSleepSummary[] }>(
    `/v2/summary/sleep/${options.userId}?${params.toString()}`,
  );
}

/** Providers Dozy exposes in Profile for cloud connect via Junction Link. */
export const DOZY_JUNCTION_PROVIDERS: JunctionProviderSlug[] = [
  "oura",
  "garmin",
  "whoop_v2",
];
