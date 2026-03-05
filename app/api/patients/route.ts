import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';

export async function GET() {
    try {
        await dbConnect();
        const patients = await Patient.find({}).sort({ createdAt: -1 });
        const formattedPatients = patients.map(p => ({
            id: p._id.toString(),
            name: p.fullName,
            age: p.age,
            gender: p.gender,
            phoneNumber: p.phoneNumber,
            address: p.address,
            pregnancyStatus: p.pregnancyStatus,
            date: p.createdAt.toLocaleDateString()
        }));
        return NextResponse.json({ success: true, patients: formattedPatients });
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const newPatient = await Patient.create(body);
        return NextResponse.json({ success: true, data: { ...newPatient.toObject(), id: newPatient._id.toString() } }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating patient:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
