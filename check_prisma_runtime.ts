
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking Prisma Client models...')
    if ('wallet' in prisma) {
        console.log('✅ prisma.wallet exists')
    } else {
        console.error('❌ prisma.wallet DOES NOT exist')
    }

    if ('transaction' in prisma) {
        console.log('✅ prisma.transaction exists')
    } else {
        console.error('❌ prisma.transaction DOES NOT exist')
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
