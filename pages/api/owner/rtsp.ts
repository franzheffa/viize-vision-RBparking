import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Phase 2 onboarding storage (stub).
 * If you have an Owner/Camera table, persist it here via Prisma.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const owner = typeof req.query.owner === "string" ? req.query.owner : "rb";
    const { ip, username, password, channel } = req.body || {};
    if (!ip || !username || !password) return res.status(400).json({ error: "ip/username/password required" });

    // TODO: persist via Prisma when your schema is ready (OwnerCamera or similar)
    return res.status(200).json({ ok: true, owner, saved: { ip, username, channel: channel || "1" } });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
