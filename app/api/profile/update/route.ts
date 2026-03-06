import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AshaWorker from '@/models/AshaWorker';
import Doctor from '@/models/Doctor';

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { userId, role, name, contact, location } = body;

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        }

        let updated;
        if (role === 'doctor') {
            updated = await Doctor.findByIdAndUpdate(
                userId,
                { $set: { name, contact, location } },
                { new: true }
            );
        } else {
            updated = await AshaWorker.findByIdAndUpdate(
                userId,
                { $set: { name, contact, location } },
                { new: true }
            );
        }

        if (!updated) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: updated._id.toString(),
                name: updated.name,
                role: updated.role,
                contact: updated.contact,
                location: updated.location,
            }
        });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
