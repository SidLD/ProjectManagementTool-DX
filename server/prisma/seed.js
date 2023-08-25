import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt'

const generateFakeData = async (num) => {
    let data = []
    for (let index = 0; index < num; index++) {
        const hashedPassword = await bcrypt.hash('12345', 10);
        data.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: hashedPassword,
            gender: false,
            email: faker.internet.email()

        })
    }
    return data
}

const generateSeed = async (data) => {
    return await prisma.user.createMany({
        data: data
    })
}

const run = async () => {
    const data = await generateFakeData(10)
    const result = await generateSeed(data)
    console.log(`Succesfully Generate ${result.count} Fake User`)
}

run()