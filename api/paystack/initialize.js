export default async function handler(req, res) {
  const token = (req.headers.authorization||"").replace("Bearer ","");
  if (!token) return res.status(401).json({ error:"Unauthorized" });
  const PRICES = { weekly:10000, monthly:29900, quarterly:69900, biannual:119900, annual:199900 };
  const amount = PRICES[req.body.plan];
  if (!amount) return res.status(400).json({ error:"Invalid plan" });
  const userRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers:{ apikey:process.env.SUPABASE_ANON_KEY, Authorization:`Bearer ${token}` }
  });
  const user = await userRes.json();
  const r = await fetch("https://api.paystack.co/transaction/initialize", {
    method:"POST",
    headers:{ Authorization:`Bearer ${process.env.sk_live_02aeed0115829f2940dc22c2b79fffc4e29da8ed}`, "Content-Type":"application/json" },
    body: JSON.stringify({ email:user.email, amount, currency:"KES",
      callback_url:`${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
      metadata:{ plan:req.body.plan, user_id:user.id } })
  });
  const j = await r.json();
  if (!j.status) return res.status(500).json({ error:j.message });
  res.json({ url:j.data.authorization_url });
}
