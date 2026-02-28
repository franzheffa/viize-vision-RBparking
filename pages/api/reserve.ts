import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

/**
 * IMPORTANT:
 * Assumes Prisma model Reservation exists:
 *  - Reservation (id, lotSlug, spotId, status, amountCents, createdAt)
 * If your schema differs, rename accordingly.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { lot, spotId } = req.body || {};
    if (!spotId || typeof spotId !== "string") return res.status(400).json({ error: "spotId required" });

    // Ensure spot exists
    const spot = await prisma.spot.findUnique({ where: { id: spotId } });
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    // Compute price (keep consistent with /spots)
    const multiplier = 1.48;
    const baseCents = Number((spot as any).basePriceCents || 0);
    const amountCents = Math.max(500, Math.round(baseCents * multiplier));

    const r = await prisma.reservation.create({
      data: {
        lotSlug: typeof lot === "string" ? lot : "rb-parking",
        spotId,
        status: "CREATED",
        amountCents
      } as any
    });

    return res.status(200).json({ ok: true, reservationId: r.id });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
