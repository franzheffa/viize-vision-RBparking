import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../lib/prisma"
import { randomBytes } from "crypto"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()
  
  const { spotId } = req.body
  if (!spotId) return res.status(400).json({ error: "spotId required" })

  try {
    const reference = `RB-${randomBytes(3).toString('hex').toUpperCase()}`
    
    const reservation = await prisma.reservation.create({
      data: {
        reference,
        spotId
      }
    })

    res.status(201).json({ reference: reservation.reference })
  } catch (e) {
    res.status(500).json({ error: "Reservation failed" })
  }
}
