import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
    // Macluumaadka Admin-ka (Adiga ayaan kuu diyaariyey)
    const email = 'kabtanaadanyare17@gmail.com' // Email-kaaga rasmiga ah
    const password = 'aadan5754' // Password-kaaga
    const name = 'Aadan Siciid' // Magacaaga sida uu kuugu jiro dashboard-ka

    console.log('--- Diyaarinta Admin Account ---')

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'ADMIN',
                password: hashedPassword
            },
            create: {
                email,
                name,
                password: hashedPassword,
                role: 'ADMIN'
            }
        })

        console.log('✅ Admin account si guul leh baa loo diyaariyey!')
        console.log(`📧 Email: ${email}`)
        console.log(`🔑 Password: ${password}`)
        console.log('--- Fadlan hadda gal barnamijka ---')

    } catch (error) {
        console.error('❌ Qalad baa dhacay:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
