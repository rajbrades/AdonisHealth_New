"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const targetId = '2745a5aa-3da0-43a5-82cf-5759a72d968f';
    console.log('Seeding timeline...');
    const user = await prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            password: 'password',
            role: 'PATIENT',
        }
    });
    let patient = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    if (!patient) {
        patient = await prisma.patientProfile.create({
            data: {
                id: targetId,
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
    await prisma.clinicalNote.create({
        data: {
            patientId,
            status: 'FINALIZED',
            assessment: 'Patient reporting improved energy levels on current protocol.',
            plan: 'Continue TRT 100mg/week. Recheck labs in 4 weeks.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
    });
    await prisma.labPanel.create({
        data: {
            patientId,
            panelName: 'Comprehensive Metabolic & Hormone Panel',
            provider: 'QUEST',
            collectionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'REVIEWED',
        },
    });
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
    await prisma.appointment.create({
        data: {
            patientId,
            scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
//# sourceMappingURL=seed-timeline.js.map