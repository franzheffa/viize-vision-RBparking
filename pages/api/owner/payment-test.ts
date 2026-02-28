import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Stub for Phase 1.
 * Replace with Interac/Stripe checkout session creation when ready.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const owner = typeof req.query.owner === "string" ? req.query.owner : "rb";
  const testId = `test_${owner}_${Date.now()}`;
  return res.status(200).json({ ok: true, testId });
}
