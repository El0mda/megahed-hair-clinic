import { supabase } from '@/lib/supabase';

// ─── Affiliate partner ────────────────────────────────────────────────────────
// The single company we hand a referral link to.
// To issue a link to a different company, change `code` here — past visits keep
// their old code, so the dashboard history stays intact.
export const PARTNER = {
  code: 'kenana-medical-tourism',
  name: 'Kenana Medical Tourism',
};

const VISITOR_KEY = 'mg_visitor_id';
const REF_KEY = 'mg_ref';
const SESSION_KEY = 'mg_ref_logged';

// Storage throws in private mode / when site data is blocked — never let that
// break the page.
const read = (store, key) => {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
};

const write = (store, key, value) => {
  try {
    store.setItem(key, value);
  } catch {
    /* ignore */
  }
};

const newId = () => {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

// A stable per-browser id, so the dashboard can separate visits from visitors.
const getVisitorId = () => {
  let id = read(localStorage, VISITOR_KEY);
  if (!id) {
    id = newId();
    write(localStorage, VISITOR_KEY, id);
  }
  return id;
};

// The full link to hand to the company.
export const buildReferralLink = (code = PARTNER.code) =>
  `${window.location.origin}/contact?ref=${encodeURIComponent(code)}`;

// Logs one visit per browser session, so refreshes and in-app navigation don't
// inflate the count. Call once, on app mount.
export async function trackReferralVisit() {
  const ref = new URLSearchParams(window.location.search).get('ref');
  if (!ref) return;

  write(localStorage, REF_KEY, ref);

  // Tidy the address bar — the code is already captured.
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('ref');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  } catch {
    /* ignore */
  }

  if (read(sessionStorage, SESSION_KEY) === ref) return;
  write(sessionStorage, SESSION_KEY, ref);

  try {
    await supabase.from('partner_visits').insert([
      {
        partner_code: ref,
        visitor_id: getVisitorId(),
        landing_path: window.location.pathname,
        referrer: document.referrer || null,
      },
    ]);
  } catch (err) {
    // Tracking must never surface to the visitor.
    console.error('referral tracking failed', err);
  }
}
