import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetId = '2745a5aa-3da0-43a5-82cf-5759a72d968f'; // Desired ID
    console.log('Seeding timeline...');

    // 0. Ensure Patient Exists
    const user = await prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            password: 'password', // Hash in real app
            role: 'PATIENT',
        }
    });

    // Check if patient exists with our desired ID, if not, create via upsert on userId
    let patient = await prisma.patientProfile.findUnique({ where: { userId: user.id } });

    if (!patient) {
        // Create new
        patient = await prisma.patientProfile.create({
            data: {
                id: targetId, // Try to set it
                userId: user.id,
                firstName: 'John',
                lastName: 'Doe',
                dob: new Date('1980-01-01'),
                gender: 'MALE',
            }
        });
    }

    const patientId = patient.id;
    console.log(`Using Patient ID: ${patientId}`);

    // 1. Create a Clinical Note (2 days ago)
    await prisma.clinicalNote.create({
        data: {
            patientId,
            status: 'FINALIZED',
            assessment: 'Patient reporting improved energy levels on current protocol.',
            plan: 'Continue TRT 100mg/week. Recheck labs in 4 weeks.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
    });

    // 2. Create a Lab Panel (5 days ago)
    await prisma.labPanel.create({
        data: {
            patientId,
            panelName: 'Comprehensive Metabolic & Hormone Panel',
            provider: 'QUEST',
            collectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            status: 'REVIEWED',
        },
    });

    // 3. Create a Check-In (Today)
    await prisma.checkIn.create({
        data: {
            patientId,
            type: 'MONTHLY',
            date: new Date(),
            metrics: {
                create: [
                    { category: 'SLEEP', score: 8, notes: 'Sleeping well' },
                    { category: 'ENERGY', score: 9 },
                ]
            }
        },
    });

    // 4. Create an Appointment (Next Week)
    await prisma.appointment.create({
        data: {
            patientId,
            scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
            status: 'SCHEDULED',
            type: 'CONSULTATION',
        }
    });

    console.log('Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
