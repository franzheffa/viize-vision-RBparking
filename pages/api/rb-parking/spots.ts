import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // On cherche le lot par son slug unique
    const lot = await prisma.parkingLot.findUnique({
      where: { slug: "rb-parking" },
      include: { 
        spots: { 
          orderBy: { code: 'asc' },
          include: { reservations: true } 
        } 
      }
    });

    if (!lot) {
      return res.status(404).json({ success: false, error: "Parking 'rb-parking' non configuré dans la DB" });
    }

    const formattedSpots = lot.spots.map(s => ({
      id: s.id,
      code: s.code,
      finalPriceCents: s.basePriceCents || 1800,
      isAvailable: s.reservations.length === 0
    }));

    return res.status(200).json({
      success: true,
      name: lot.name,
      spots: formattedSpots
    });
  } catch (error) {
    console.error("RB-API ERROR:", error);
    return res.status(500).json({ success: false, error: "Database Connection Error" });
  }
}
