import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FollowUp from '@/models/FollowUp';

export async function GET() {
    try {
        await dbConnect();
        const followups = await FollowUp.find({}).sort({ scheduledDate: 1 });
        const formatted = followups.map(f => ({
            id: f._id.toString(),
            patientName: f.patientName,
            patientId: f.patientId?.toString() || null,
            symptoms: f.symptoms,
            triageLevel: f.triageLevel,
            scheduledDate: f.scheduledDate
        }));
        return NextResponse.json({ success: true, followups: formatted });
    } catch (error: any) {
        console.error('Error fetching followups:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const newFollowup = await FollowUp.create(body);
        return NextResponse.json({ success: true, data: newFollowup }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating followup:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
