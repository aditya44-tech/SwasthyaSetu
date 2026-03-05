import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
    try {
        await dbConnect();

        // Check if users already exist
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return NextResponse.json({ success: true, message: 'Database already seeded with users' });
        }

        const asha = await User.create({
            name: 'Sunita Sharma',
            role: 'asha',
            contact: '+91 98765 43210',
            location: 'Village Health Center A'
        });

        const doctor = await User.create({
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
