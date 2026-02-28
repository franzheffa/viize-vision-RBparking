import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lot = await prisma.parkingLot.findUnique({
      where: { slug: "rb-parking" },
      include: { 
        spots: { 
          include: { reservations: true } 
        } 
      }
    });

    if (!lot) {
      return res.status(404).json({ error: "Parking Lot 'rb-parking' not found" });
    }

    return res.status(200).json({
      success: true,
      name: lot.name,
      spots: lot.spots.map(s => ({
        id: s.id,
        code: s.code,
        finalPriceCents: s.basePriceCents,
        isAvailable: s.reservations.length === 0
      }))
    });
  } catch (error) {
    console.error("RB-Parking API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
