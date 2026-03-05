import { NextRequest, NextResponse } from 'next/server';
import { analyzeSymptoms } from '@/lib/symptomEngine';

export async function POST(req: NextRequest) {
    try {
        const { input, patientContext } = await req.json();

        if (!input || !input.trim()) {
            return NextResponse.json({ error: 'No symptoms provided' }, { status: 400 });
        }

        const result = analyzeSymptoms(input, patientContext);
        return NextResponse.json(result);
    } catch (err: unknown) {
        console.error("Analysis Error:", err);
        const message = err instanceof Error ? err.message : 'Failed to analyze symptoms';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
