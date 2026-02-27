import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const lot = await prisma.parkingLot.upsert({
    where: { slug: 'rb-parking' },
    update: {},
    create: {
      name: 'RB Parking - Quartier Latin',
      slug: 'rb-parking',
      platformFeeBps: 500,
    },
  })

  // Génération des 20 places alignées sur ton interface
  const spots = Array.from({ length: 20 }).map((_, i) => ({
    code: `#${String(i + 1).padStart(2, "0")}`,
    type: "Standard",
    price: 1800 + (i % 3) * 125 // Aligné sur la logique de prix du POC (18.00 CAD + delta)
  }))

  console.log("🚀 Injection de 20 places dans la base de données...");

  for (const s of spots) {
    await prisma.spot.upsert({
      where: { code: s.code },
      update: { basePriceCents: s.price },
      create: {
        code: s.code,
        type: s.type,
        basePriceCents: s.price,
        parkingLotId: lot.id
      }
    })
  }
  console.log("✅ Base de données initialisée avec succès.");
}

main()
  .catch((e) => { console.error("❌ Erreur de seeding:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
