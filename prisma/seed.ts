import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.parkingLot.upsert({
    where: { slug: 'rb-parking' },
    update: {},
    create: {
      slug: 'rb-parking',
      name: 'RB Parking Premium',
      platformFeeBps: 800,
      spots: {
        create: [
          { code: 'A1', basePriceCents: 1500 },
          { code: 'A2', basePriceCents: 1500 },
          { code: 'B1', basePriceCents: 2500 }
        ]
      }
    }
  })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
