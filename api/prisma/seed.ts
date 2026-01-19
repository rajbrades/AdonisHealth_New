
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Users (Patient, Provider)
    const patientPassword = await bcrypt.hash('password123', 10);
    const providerPassword = await bcrypt.hash('password123', 10);

    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@example.com' },
        update: {},
        create: {
            email: 'patient@example.com',
            password: patientPassword,
            role: 'PATIENT',
        },
    });

    const providerUser = await prisma.user.upsert({
        where: { email: 'dr.stone@adonis.health' },
        update: {},
        create: {
            email: 'dr.stone@adonis.health',
            password: providerPassword,
            role: 'PROVIDER',
        },
    });

    // 2. Create Profiles
    const patientProfile = await prisma.patientProfile.upsert({
        where: { userId: patientUser.id },
        update: {},
        create: {
            userId: patientUser.id,
            firstName: 'John',
            lastName: 'Doe',
            dob: new Date('1985-04-12'),
            gender: 'MALE',
            phone: '555-0101',
            address: '123 Health Way, Wellness City, CA',
        },
    });

    await prisma.providerProfile.upsert({
        where: { userId: providerUser.id },
        update: {},
        create: {
            userId: providerUser.id,
            firstName: 'Marcus',
            lastName: 'Stone',
            specialty: 'Endocrinology',
            deaNumber: 'AB1234567',
        },
    });

    // 3. Create Products (Simulated Regimen Items)
    const trtCream = await prisma.product.upsert({
        where: { sku: 'TRT-CREAM-200' },
        update: {},
        create: {
            name: 'Testosterone Cream',
            description: 'Bioidentical Testosterone Cream 200mg/ml',
            price: 150.00,
            sku: 'TRT-CREAM-200',
            type: 'RX',
        },
    });

    const vitD = await prisma.product.upsert({
        where: { sku: 'VIT-D3-5000' },
        update: {},
        create: {
            name: 'Vitamin D3 + K2',
            description: 'High potency D3',
            price: 35.00,
            sku: 'VIT-D3-5000',
            type: 'SUPPLEMENT',
        },
    });

    // 4. Create Regimen
    await prisma.activeRegimen.create({
        data: {
            patientId: patientProfile.id,
            productId: trtCream.id,
            name: trtCream.name,
            dosage: '200mg (1 click)',
            frequency: 'Daily AM',
            type: 'RX',
            source: 'INTERNAL',
        },
    });

    await prisma.activeRegimen.create({
        data: {
            patientId: patientProfile.id,
            productId: vitD.id,
            name: vitD.name,
            dosage: '5000 IU',
            frequency: 'Daily with meal',
            type: 'SUPPLEMENT',
            source: 'INTERNAL',
        },
    });

    // 5. Create Goals
    await prisma.patientGoal.createMany({
        data: [
            {
                patientId: patientProfile.id,
                type: 'SHORT_TERM',
                description: 'energy_boost',
                status: 'ACTIVE',
            },
            {
                patientId: patientProfile.id,
                type: 'SHORT_TERM',
                description: 'sleep_opt',
                status: 'ACTIVE',
            },
            {
                patientId: patientProfile.id,
                type: 'MEDIUM_TERM',
                description: 'Weight Loss (10lbs)',
                status: 'ACTIVE',
            },
        ],
    });

    // 6. Create Wearable Data
    await prisma.wearableData.create({
        data: {
            patientId: patientProfile.id,
            source: 'OURA',
            date: new Date(),
            metrics: JSON.stringify({
                sleepScore: 88,
                hrv: 45,
                steps: 10240,
                readiness: 92
            }),
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
