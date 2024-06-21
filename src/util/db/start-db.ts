import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const sound = await prisma.sound.findMany()
    console.log(sound)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })