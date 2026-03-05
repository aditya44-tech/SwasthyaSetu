import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Consultation from '@/models/Consultation';

// POST - Create a new consultation (when doctor starts a call)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { caseId, patientName, roomName } = body;

        if (!caseId || !patientName || !roomName) {
            return NextResponse.json({ error: 'caseId, patientName, and roomName are required' }, { status: 400 });
        }

        const consultation = await Consultation.create({
            caseId,
            patientName,
            roomName,
            status: 'active',
        });

        return NextResponse.json({ consultation }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// GET - Fetch consultations (optionally by caseId or active status)
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const caseId = searchParams.get('caseId');
        const status = searchParams.get('status');
        const patientName = searchParams.get('patientName');

        const filter: any = {};
        if (caseId) filter.caseId = caseId;
        if (status) filter.status = status;
        if (patientName) filter.patientName = patientName;

        const consultations = await Consultation.find(filter).sort({ startedAt: -1 });
        return NextResponse.json({ consultations });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH - Update a consultation (post-call notes, prescriptions, etc.)
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { consultationId, notes, prescriptions, riskLevel, patientStatus } = body;

        if (!consultationId) {
            return NextResponse.json({ error: 'consultationId is required' }, { status: 400 });
        }

        const update: any = { status: 'completed', endedAt: new Date() };
        if (notes !== undefined) update.notes = notes;
        if (prescriptions !== undefined) update.prescriptions = prescriptions;
        if (riskLevel !== undefined) update.riskLevel = riskLevel;
        if (patientStatus !== undefined) update.patientStatus = patientStatus;

        const consultation = await Consultation.findByIdAndUpdate(consultationId, update, { new: true });

        if (!consultation) {
            return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
        }

        return NextResponse.json({ consultation });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
