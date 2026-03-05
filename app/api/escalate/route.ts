import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EscalatedCase from '@/models/EscalatedCase';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const patientName = body.patient?.fullName;

        if (!patientName) {
            return NextResponse.json({ success: false, error: 'Patient name required' }, { status: 400 });
        }

        // Check for existing active (non-resolved) case for this patient
        const existing = await EscalatedCase.findOne({
            'patient.fullName': patientName,
            status: { $ne: 'resolved' }
        });

        if (existing) {
            // Return the existing case instead of creating a duplicate
            return NextResponse.json({
                success: true,
                data: existing,
                message: 'Active case already exists for this patient'
            }, { status: 200 });
        }

        const newCase = await EscalatedCase.create(body);

        return NextResponse.json({ success: true, data: newCase }, { status: 201 });
    } catch (error: any) {
        console.error('Error escalating case:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to escalate case' }, { status: 500 });
    }
}
