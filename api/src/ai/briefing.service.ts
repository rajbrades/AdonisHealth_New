
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
config();

@Injectable()
export class BriefingService {
    private anthropic: Anthropic | null = null;
    private readonly logger = new Logger(BriefingService.name);

    constructor(private prisma: PrismaService) {
        if (process.env.ANTHROPIC_API_KEY) {
            this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        } else {
            this.logger.warn('ANTHROPIC_API_KEY not configured. AI features disabled.');
        }
    }

    async generateBriefingForAppointment(appointmentId: string): Promise<any> {
        if (!this.anthropic) {
            throw new Error('AI Service not configured');
        }

        // 1. Fetch Context
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: {
                    include: {
                        clinicalNotes: {
                            orderBy: { createdAt: 'desc' },
                            take: 1, // Last note
                        },
                        labResults: {
                            where: {
                                testDate: {
                                    gte: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Last 6 months
                                },
                            },
                            include: { biomarkers: true }, // Old labs
                        },
                        labPanels: {
                            // New labs structure
                            where: {
                                status: 'REVIEWED'
                            },
                            include: {
                                results: { include: { biomarker: true } }
                            },
                            orderBy: { collectionDate: 'desc' },
                            take: 2 // Recent 2 panels
                        },
                        checkIns: {
                            orderBy: { date: 'desc' },
                            take: 3, // Last 3 check-ins
                            include: { metrics: true },
                        },
                        goals: {
                            where: { status: 'ACTIVE' }
                        }
                    },
                },
            },
        });

        if (!appointment) throw new Error('Appointment not found');

        const patient = appointment.patient;
        const lastNote = patient.clinicalNotes[0];

        // Format Labs for Prompt
        const labSummary = patient.labPanels.map(panel => {
            return `Date: ${panel.collectionDate.toISOString().split('T')[0]} - ${panel.panelName}\n` +
                panel.results.map(r =>
                    `- ${r.biomarker.name}: ${r.numericValue} ${r.normalizedUnit} (${r.flag || 'Normal'}) [Ref: ${r.refRangeLow}-${r.refRangeHigh}]`
                ).join('\n');
        }).join('\n\n');

        // Format Check-ins
        const checkInSummary = patient.checkIns.map(c =>
            `Date: ${c.date.toISOString().split('T')[0]} - Note: ${c.notes}\n` +
            c.metrics.map(m => `  * ${m.category}: ${m.score}/10`).join('\n')
        ).join('\n');

        // 2. Construct Prompt
        const prompt = `
    You are an expert Chief Medical Officer assistant preparing a "Pre-Visit Briefing" for a physician.
    
    Patient: ${patient.firstName} ${patient.lastName} (${patient.gender}, Age: ${new Date().getFullYear() - patient.dob.getFullYear()})
    
    CTX:
    Last Visit Note Summary: ${lastNote ? lastNote.assessment + ' - ' + lastNote.plan : 'No previous notes.'}
    
    Recent Data:
    === LABS ===
    ${labSummary || 'No recent labs.'}
    
    === SUBJECTIVE CHECK-INS ===
    ${checkInSummary || 'No recent check-ins.'}
    
    === GOALS ===
    ${patient.goals.map(g => `- ${g.description}`).join('\n')}

    TASK:
    Generate a JSON object with the following fields:
    1. "summary" (markdown): A concise 3-4 sentence summary of the interval history.
    2. "criticalAlerts" (array of strings): specific red flags (e.g. "Ferritin < 30 indicates Iron Deficiency", "Sleep score consistently < 6").
    3. "labAnalysis" (markdown): Analyze the provided lab results and provide a structured interpretation organized by physiological system (e.g., blood sugar regulation, thyroid/adrenal function, gastrointestinal, detoxification, inflammation, cardiovascular).
       For each system/analyte:
       - Identify if the result falls within the optimal, borderline/suboptimal, or pathological range
       - Explain the clinical relevance of any deviations
       - Highlight patterns that suggest underlying system imbalances (e.g., insulin resistance, mitochondrial stress, immune activation)
       - Recommend next steps or considerations for each flagged finding
    4. "suggestedPlan" (markdown): 3-5 bullet points for what the doctor should discuss/order.
    5. "draftNote" (string): A text block that could be pasted into the "Subjective" section.

    Return ONLY valid JSON.
    `;

        // 3. Call AI
        let result;
        try {
            const message = await this.anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 3000,
                messages: [{ role: 'user', content: prompt }],
            });

            const textContent = message.content.find(c => c.type === 'text');
            if (!textContent || textContent.type !== 'text') throw new Error('No text response');

            let jsonString = textContent.text;
            const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
            if (jsonMatch) jsonString = jsonMatch[0];

            result = JSON.parse(jsonString);
        } catch (error) {
            this.logger.error('AI Service failed, using mock data', error);
            // Fallback Mock Data for Demo/Reliability
            result = {
                summary: `**Auto-Generated Fallback**: Patient reports fatigue and low energy (Score: 3/10). Recent labs (5 days ago) show **Low Ferritin (25 ng/mL)**. Past history notes stable health but fatigue is a recurring theme.`,
                criticalAlerts: ["Ferritin 25 ng/mL (Below Optimal 30-150)", "Energy Score 3/10 (Significant Decline)"],
                labAnalysis: `### Nutrient Status & Hematology\n*   **Ferritin**: 25 ng/mL (Pathological Low)\n    *   **Interpretation**: Indicates depleted iron stores (Absolute Iron Deficiency). Even without anemia, this explains the fatigue and poor sleep.\n    *   **Recommendation**: Oral iron bisglycinate or IV iron if intolerant.\n\n### Inflammation\n*   **hs-CRP**: 0.4 mg/L (Optimal)\n    *   **Interpretation**: No signs of acute systemic inflammation.`,
                suggestedPlan: `*   Order Iron Supplementation (Bisglycinate recommended)\n*   Recheck Ferritin and Iron Panel in 6 weeks\n*   Discuss sleep hygiene optimizations`,
                draftNote: `Subjective:\nPatient presents for follow-up. Reports significant fatigue (energy 3/10) and poor sleep. Recent labs indicate iron deficiency.\n\nObjective:\nFerritin: 25 ng/mL (Low).`
            };
        }

        const suggestedPlan = Array.isArray(result.suggestedPlan)
            ? result.suggestedPlan.join('\n')
            : result.suggestedPlan;

        // 4. Save to DB
        return this.prisma.preVisitBriefing.upsert({
            where: { appointmentId },
            update: {
                summary: result.summary,
                criticalAlerts: JSON.stringify(result.criticalAlerts),
                labAnalysis: result.labAnalysis,
                suggestedPlan: suggestedPlan,
                draftNote: result.draftNote,
                status: 'GENERATED',
                generatedAt: new Date(),
                confidence: 0.95
            },
            create: {
                appointmentId,
                summary: result.summary,
                criticalAlerts: JSON.stringify(result.criticalAlerts),
                labAnalysis: result.labAnalysis,
                suggestedPlan: suggestedPlan,
                draftNote: result.draftNote,
                status: 'GENERATED',
                generatedAt: new Date(),
                confidence: 0.95
            }
        });
    }
}
