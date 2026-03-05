import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();
        const ashaWorker = await User.findOne({ role: 'asha' });

        if (!ashaWorker) {
            return NextResponse.json({ success: false, error: 'ASHA worker not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            profile: {
                id: ashaWorker._id.toString(),
                name: ashaWorker.name,
                role: ashaWorker.role,
                contact: ashaWorker.contact,
                location: ashaWorker.location,
                createdAt: ashaWorker.createdAt,
            }
        });
    } catch (error: any) {
        console.error('Error fetching ASHA profile:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
