import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const spots = await prisma.spot.findMany({
      include: { reservations: true }
    })

    const totalSpots = spots.length
    const occupiedSpots = spots.filter(s => s.reservations.length > 0).length
    const occupancyRate = occupiedSpots / totalSpots

    // Multiplicateur : Prix x1 à 0% d'occupation, x2 à 100%
    const demandMultiplier = 1 + occupancyRate

    const response = {
      occupancy: Math.round(occupancyRate * 100),
      revenueCents: spots.reduce((acc, s) => acc + (s.reservations.length * s.basePriceCents), 0),
      spots: spots.map(s => ({
        id: s.id,
        code: s.code,
        type: s.type,
        finalPriceCents: Math.round(s.basePriceCents * demandMultiplier),
        isAvailable: s.reservations.length === 0
      }))
    }

    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error })
  }
}
