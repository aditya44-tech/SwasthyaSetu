import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AshaWorker from '@/models/AshaWorker';
import Doctor from '@/models/Doctor';

export async function POST() {
    try {
        await dbConnect();

        // Check if users already exist in either collection
        const ashaCount = await AshaWorker.countDocuments();
        const doctorCount = await Doctor.countDocuments();
        if (ashaCount > 0 || doctorCount > 0) {
            return NextResponse.json({ success: true, message: 'Database already seeded with users' });
        }

        const asha = await AshaWorker.create({
            name: 'Sunita Sharma',
            role: 'asha',
            contact: '+91 98765 43210',
            location: 'Village Health Center A'
        });

        const doctor = await Doctor.create({
            name: 'Dr. Mehta',
            role: 'doctor',
            contact: '+91 91234 56789',
            location: 'District Hospital'
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully seeded database',
            data: { asha, doctor }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error seeding database:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
