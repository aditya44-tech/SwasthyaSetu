import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();
        const doctor = await User.findOne({ role: 'doctor' });

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
