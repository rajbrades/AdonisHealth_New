
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Briefing Test Data...');

    // 1. Get the existing Patient (John Doe) from the main seed
    const patientUser = await prisma.user.findUnique({
        where: { email: 'patient@example.com' },
        include: { patientProfile: true },
    });

    if (!patientUser || !patientUser.patientProfile) {
        console.error('Patient not found. Run main seed first.');
        return;
    }

    const patientId = patientUser.patientProfile.id;

    // 2. Create a Past Clinical Note (3 months ago)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    await prisma.clinicalNote.create({
        data: {
            patientId: patientId,
            status: 'FINALIZED',
            subjective: 'Patient reports feeling generally well but notes some afternoon fatigue.',
            objective: 'Vitals stable. Weight 185lbs.',
            assessment: 'Stable health. Monitor fatigue.',
            plan: 'Continue current regimen. Recheck labs in 3 months.',
            createdAt: threeMonthsAgo,
            updatedAt: threeMonthsAgo,
        },
    });
    console.log('Created past clinical note.');

    // 3. Create Recent Lab Results (Abnormal Ferritin)
    // First ensure the Biomarker exists in Catalog
    let ferritin = await prisma.biomarkerCatalog.findUnique({ where: { code: 'FERRITIN' } });
    if (!ferritin) {
        ferritin = await prisma.biomarkerCatalog.create({
            data: {
                code: 'FERRITIN',
                name: 'Ferritin',
                category: 'Iron Panel',
                defaultUnit: 'ng/mL',
                optimalRangeLow: 50,
                optimalRangeHigh: 150,
                refRangeLow: 30,
                refRangeHigh: 400,
            }
        });
    }

    const labDate = new Date();
    labDate.setDate(labDate.getDate() - 5); // 5 days ago

    const labPanel = await prisma.labPanel.create({
        data: {
            patientId: patientId,
            labType: 'BLOOD_PANEL',
            provider: 'QUEST',
            panelName: 'Iron Assessment',
            collectionDate: labDate,
            status: 'REVIEWED',
            results: {
                create: [
                    {
                        biomarkerId: ferritin.id,
                        rawValue: '25',
                        numericValue: 25,
                        rawUnit: 'ng/mL',
                        normalizedUnit: 'ng/mL',
                        flag: 'LOW', // Below optimal and ref
                        refRangeLow: 30,
                        refRangeHigh: 400,
                        optimalRangeLow: 50,
                        optimalRangeHigh: 150,
                    }
                ]
            }
        }
    });
    console.log('Created recent abnormal lab panel.');

    // 4. Create Recent Check-In (Low Energy)
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() - 2); // 2 days ago

    await prisma.checkIn.create({
        data: {
            patientId: patientId,
            date: checkInDate,
            type: 'ADHOC',
            notes: 'Feeling extra tired lately.',
            metrics: {
                create: [
                    { category: 'ENERGY', score: 3, notes: 'Struggling to get out of bed' },
                    { category: 'SLEEP', score: 6, notes: 'Waking up early' }
                ]
            }
        }
    });
    console.log('Created recent check-in with low energy score.');

    // 5. Create Upcoming Appointment (Tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0);

    const appointment = await prisma.appointment.create({
        data: {
            patientId: patientId,
            scheduledAt: tomorrow,
            endTime: endTime,
            status: 'SCHEDULED',
            type: 'CONSULTATION',
        }
    });
    console.log(`Created appointment for tomorrow having ID: ${appointment.id}`);

    console.log('Briefing Seed Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
