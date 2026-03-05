import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EscalatedCase from '@/models/EscalatedCase';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all cases, sorted by newest first
        const cases = await EscalatedCase.find({}).sort({ createdAt: -1 });

        // Format them to match the frontend expectations
        const formattedCases = cases.map(c => ({
            id: c._id.toString(),
            patient: c.patient,
            symptoms: c.symptoms,
            analysis: c.analysis,
            escalatedAt: c.escalatedAt,
            status: c.status
        }));

        return NextResponse.json({ success: true, cases: formattedCases });
    } catch (error: any) {
        console.error('Error fetching cases:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch cases' }, { status: 500 });
    }
}
