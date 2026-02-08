
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Users (Patient, Provider)
    // Passwords must be 12+ chars, include uppercase, lowercase, number, and special char
    const strongPassword = await bcrypt.hash('Adonis@2026!Secure', 10);
    const patientPassword = strongPassword;
    const providerPassword = strongPassword;

    const patientUser = await prisma.user.upsert({
        where: { email: 'patient@example.com' },
        update: {
            password: patientPassword,
            passwordChangedAt: new Date(),
        },
        create: {
            email: 'patient@example.com',
            password: patientPassword,
            role: 'PATIENT',
            passwordChangedAt: new Date(),
        },
    });

    const providerUser = await prisma.user.upsert({
        where: { email: 'dr.stone@adonis.health' },
        update: {
            password: providerPassword,
            passwordChangedAt: new Date(),
        },
        create: {
            email: 'dr.stone@adonis.health',
            password: providerPassword,
            role: 'PROVIDER',
            passwordChangedAt: new Date(),
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

    const providerProfile = await prisma.providerProfile.upsert({
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

    // 7. Create Appointments for ALL users (to ensure developer sees them)
    const allPatients = await prisma.patientProfile.findMany();

    const today = new Date();
    const twoDaysFromNow = new Date(today); twoDaysFromNow.setDate(today.getDate() + 2); twoDaysFromNow.setHours(14, 0, 0, 0);
    const fiveDaysFromNow = new Date(today); fiveDaysFromNow.setDate(today.getDate() + 5); fiveDaysFromNow.setHours(10, 30, 0, 0);
    const tenDaysFromNow = new Date(today); tenDaysFromNow.setDate(today.getDate() + 10); tenDaysFromNow.setHours(9, 0, 0, 0);

    const threeDaysAgo = new Date(today); threeDaysAgo.setDate(today.getDate() - 3); threeDaysAgo.setHours(11, 0, 0, 0);
    const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14); twoWeeksAgo.setHours(15, 0, 0, 0);
    const oneMonthAgo = new Date(today); oneMonthAgo.setMonth(today.getMonth() - 1); oneMonthAgo.setHours(13, 0, 0, 0);

    for (const patient of allPatients) {
        // Check only for existing appointments to avoid duplication
        const existingCount = await prisma.appointment.count({
            where: { patientId: patient.id }
        });

        if (existingCount > 0) {
            console.log(`Skipping appointments for ${patient.firstName} ${patient.lastName} (already has data)`);
            continue;
        }

        console.log(`Seeding appointments for ${patient.firstName} ${patient.lastName}...`);

        // 1. Scheduled: Upcoming Telehealth
        await prisma.appointment.create({
            data: {
                patientId: patient.id,
                providerId: providerProfile.id,
                title: 'Protocol Review',
                type: 'TELEHEALTH',
                status: 'SCHEDULED',
                date: twoDaysFromNow,
                duration: 30,
                location: 'Zoom Meeting',
                notes: 'Please have your latest blood pressure readings ready. Code: ADONIS-8821',
            }
        });

        // 2. Scheduled: Lab Draw (Future)
        await prisma.appointment.create({
            data: {
                patientId: patient.id,
                title: 'Quarterly Lipid Panel',
                type: 'LAB_DRAW',
                status: 'SCHEDULED',
                date: tenDaysFromNow,
                duration: 15,
                location: 'Quest Diagnostics',
                notes: 'Fasting 12 hours required.',
            }
        });

        // 3. Pending: User Requested
        await prisma.appointment.create({
            data: {
                patientId: patient.id,
                providerId: providerProfile.id,
                title: 'Discuss Dosage Change',
                type: 'TELEHEALTH',
                status: 'PENDING',
                date: fiveDaysFromNow,
                duration: 30,
                notes: 'Patient requested to increase dosage due to fatigue.',
            }
        });

        // 4. Completed: Past Consultation
        await prisma.appointment.create({
            data: {
                patientId: patient.id,
                providerId: providerProfile.id,
                title: 'Initial Health Assessment',
                type: 'TELEHEALTH',
                status: 'COMPLETED',
                date: oneMonthAgo,
                duration: 60,
                location: 'Zoom Meeting',
                notes: 'Patient onboarding complete. Prescribed initial protocol.',
            }
        });

        // 5. Completed: Follow-up
        await prisma.appointment.create({
            data: {
                patientId: patient.id,
                providerId: providerProfile.id,
                title: '2-Week Follow-up',
                type: 'TELEHEALTH',
                status: 'COMPLETED',
                date: twoWeeksAgo,
                duration: 30,
                notes: 'Patient is tolerating medication well.',
            }
        });

        // 6. Cancelled: Recent
        await prisma.appointment.create({
            data: {
                patientId: patient.id,
                providerId: providerProfile.id,
                title: 'Quick Check-in',
                type: 'TELEHEALTH',
                status: 'CANCELLED',
                date: threeDaysAgo,
                duration: 15,
                cancelledAt: new Date(threeDaysAgo.getTime() - 86400000),
                cancellationReason: 'Work conflict',
                notes: 'Patient rescheduled to next week.',
            }
        });
    }

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
