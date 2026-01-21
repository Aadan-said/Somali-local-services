import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
    const email = 'kabtanaadanyare17@gmail.com'
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user) {
            console.log('--- USER DATA START ---')
            console.log(JSON.stringify(user, null, 2))
            console.log('--- USER DATA END ---')
        } else {
            console.log('❌ User not found')
        }
    } catch (e) {
        console.error('Error fetching user:', e)
    } finally {
        await prisma.$disconnect()
    }
}

checkUser()
