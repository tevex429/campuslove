import crypto from "crypto";
export default async function handler(req, res) {
  const raw = JSON.stringify(req.body);
  const sig = req.headers["x-paystack-signature"]||"";
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(raw).digest("hex");
  if (hash !== sig) return res.status(401).end();
  const ev = req.body;
  if (ev.event === "charge.success") {
    const d = ev.data;
    // insert into payments + subscriptions via Supabase service role key
    // (use supabase-js with SUPABASE_SERVICE_ROLE_KEY here — this file is server-only)
  }
  res.json({ ok:true });
}
