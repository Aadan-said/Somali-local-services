
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('Found users:', users.length)
    users.forEach((u) => {
        console.log(`- ${u.email} (Role: ${u.role}) - Status: ${u.accountStatus || 'N/A'}`)
    })
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
