import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lot = await prisma.parkingLot.findUnique({
      where: { slug: "rb-parking" },
      include: { spots: { include: { reservations: true } } }
    });

    if (!lot) {
      // Si le lot n'existe pas, on renvoie une erreur explicite
      return res.status(200).json({ 
        success: false, 
        error: "DATABASE_EMPTY: Le parking 'rb-parking' n'existe pas dans la base." 
      });
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
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
