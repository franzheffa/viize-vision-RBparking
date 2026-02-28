import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

/**
 * IMPORTANT:
 * This route assumes Prisma models exist:
 *  - ParkingLot (id, slug, name, address, city, country)
 *  - Spot (id, lotId, code, type, basePriceCents, isEv, evKw)
 *
 * If your schema uses different names, rename the Prisma calls accordingly.
 */
function dynamicPriceCad(baseCad: number, multiplier: number) {
  const v = Math.round(baseCad * multiplier * 100) / 100;
  return Math.max(5, v);
}

function kmPerHourFromKw(kw: number, efficiencyKwhPer100km = 18) {
  const kwhPerKm = efficiencyKwhPer100km / 100;
  return Math.round((kw / Math.max(0.1, kwhPerKm)) * 10) / 10;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lot = typeof req.query.lot === "string" ? req.query.lot : "rb-parking";
    const spotId = typeof req.query.spotId === "string" ? req.query.spotId : "";

    // 1) Ensure RB lot exists
    const rbLot = await prisma.parkingLot.upsert({
      where: { slug: lot },
      update: {},
      create: {
        slug: lot,
        name: "RB Parking",
        address: "1439 Rue Saint-Timothée",
        city: "Montréal",
        country: "Canada"
      }
    });

    // 2) Ensure 20 spots exist (STANDARD 16 + EV 4)
    const existingCount = await prisma.spot.count({ where: { lotId: rbLot.id } });

    if (existingCount < 20) {
      const toCreate = [];
      for (let i = 1; i <= 20; i++) {
        const code = `#${String(i).padStart(2, "0")}`;
        const isEv = i === 4 || i === 8 || i === 12 || i === 16; // EV placeholders
        const baseCents = isEv ? 2175 : 1450; // rough base like your MVP
        const evKw = isEv ? (i === 4 ? 50 : i === 8 ? 100 : i === 12 ? 150 : 250) : null;
        toCreate.push({
          lotId: rbLot.id,
          code,
          type: isEv ? "EV" : "STANDARD",
          basePriceCents: baseCents,
          isEv,
          evKw
        });
      }

      // Create missing spots idempotently by code
      for (const s of toCreate) {
        await prisma.spot.upsert({
          where: { lotId_code: { lotId: s.lotId, code: s.code } },
          update: {
            type: s.type as any,
            basePriceCents: s.basePriceCents,
            isEv: s.isEv,
            evKw: s.evKw as any
          },
          create: s as any
        });
      }
    }

    // 3) Load spots
    const spots = await prisma.spot.findMany({
      where: { lotId: rbLot.id },
      orderBy: { code: "asc" }
    });

    const multiplier = 1.48; // IA x1.48 vibe from your UI
    const mapped = spots.map((s: any) => {
      const baseCad = (s.basePriceCents || 0) / 100;
      const priceCad = dynamicPriceCad(baseCad, multiplier);
      const status: "REPORTED" = "REPORTED";
      const evKw = s.isEv ? Number(s.evKw || 0) : null;
      const estKmPerHour = s.isEv ? kmPerHourFromKw(evKw || 0, 18) : null;

      return {
        id: s.id,
        code: s.code,
        type: s.isEv ? "EV" : "STANDARD",
        priceCad,
        status,
        evKw,
        estKmPerHour
      };
    });

    if (spotId) {
      const one = mapped.find((x) => x.id === spotId);
      if (!one) return res.status(404).json({ error: "Spot not found" });
      return res.status(200).json({ spot: one });
    }

    return res.status(200).json({ spots: mapped });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
