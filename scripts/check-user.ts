import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
    const email = 'kabtanaadanyare17@gmail.com'
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (user) {
        console.log('--- Isticmaalaha la helay ---')
        console.log(`Magaca: ${user.name}`)
        console.log(`Email: ${user.email}`)
        console.log(`Role: ${user.role}`)
        console.log('---------------------------')
    } else {
        console.log('❌ Isticmaalaha lama helin!')
    }
    await prisma.$disconnect()
}

checkUser()
