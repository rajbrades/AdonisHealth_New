
export interface PatientGoal {
    id: string;
    type: string; // SHORT_TERM, MEDIUM_TERM
    description: string;
    status: string;
}

export interface ActiveRegimen {
    id: string;
    name: string;
    dosage: string | null;
    frequency: string | null;
    type: string; // SUPPLEMENT, RX
    source: string;
    active: boolean;
}

export interface WearableData {
    id: string;
    source: string;
    metrics: string; // JSON string
    date: string;
}

export interface PatientProfile {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phone: string | null;
    address: string | null;
    goals: PatientGoal[];
    regimen: ActiveRegimen[];
    wearableData: WearableData[];
}


export interface PatientListItem extends PatientProfile {
    user: {
        email: string;
        role: string;
        createdAt: string;
    };
    clinicalNotes: {
        id: string;
        status: string;
        createdAt: string;
    }[];
}

const API_URL = 'http://localhost:3001';

export async function getPatients(): Promise<PatientListItem[]> {
    try {
        const res = await fetch(`${API_URL}/patients`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch patients:', res.statusText);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
}

export async function getPatient(id: string): Promise<PatientProfile | null> {
    try {
        let url = `${API_URL}/patients/${id}`;

        // Helper for testing: fetch first patient if id is 'test' or '1'
        if (id === 'test' || id === '1') {
            const allRes = await fetch(`${API_URL}/patients`, { cache: 'no-store' });
            if (!allRes.ok) throw new Error('Failed to fetch patients');
            const all = await allRes.json();
            if (all.length > 0) {
                // Fetch full details for the first one
                url = `${API_URL}/patients/${all[0].id}`;
            }
        }

        const res = await fetch(url, { cache: 'no-store' }); // No caching for dev
        if (!res.ok) {
            console.error('Failed to fetch patient:', res.statusText);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching patient:', error);
        return null;
    }
}

// Rewriting cleaner replacement to target just the API_URL line and insert before/after
