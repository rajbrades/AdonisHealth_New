"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
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
//# sourceMappingURL=seed.js.map