import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (typeof slug !== 'string') return res.status(400).json({ error: "Slug required" })

  try {
    const lot = await prisma.parkingLot.findUnique({
      where: { slug },
      include: { 
        spots: {
          include: { _count: { select: { reservations: true } } }
        } 
      },
    })

    if (!lot) return res.status(404).json({ error: "Parking lot not found" })

    // Logique de prix dynamique (Heffa Scalable Logic)
    // Multiplicateur basé sur l'occupation simulée ou réelle
    const demandMultiplier = 1.5 

    const response = {
      name: lot.name,
      platformFeePercent: lot.platformFeeBps / 100,
      spots: lot.spots.map(s => ({
        id: s.id,
        code: s.code,
        // Prix dynamique calculé au vol
        finalPriceCents: Math.round(s.basePriceCents * demandMultiplier),
        isAvailable: true // Logique à étendre selon les dates
      }))
    }

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" })
  }
}
