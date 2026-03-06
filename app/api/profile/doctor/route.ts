import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

export async function GET() {
    try {
        await dbConnect();
        const doctor = await Doctor.findOne();

        if (!doctor) {
            return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            profile: {
                id: doctor._id.toString(),
                name: doctor.name,
                role: doctor.role,
                contact: doctor.contact,
                location: doctor.location,
                createdAt: doctor.createdAt,
            }
        });
    } catch (error: any) {
        console.error('Error fetching doctor profile:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
