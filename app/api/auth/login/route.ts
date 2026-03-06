import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AshaWorker from '@/models/AshaWorker';
import Doctor from '@/models/Doctor';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { phone, password, role } = body;

        // Find user in the correct collection based on role
        const user = role === 'asha'
            ? await AshaWorker.findOne({ contact: phone })
            : await Doctor.findOne({ contact: phone });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found. Please register first.' }, { status: 404 });
        }

        // Simple password check (in production, use bcrypt)
        if (user.password && user.password !== password) {
            return NextResponse.json({ success: false, error: 'Invalid password.' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                role: user.role,
                contact: user.contact,
                location: user.location,
                ashaId: (user as any).ashaId,
                specialization: (user as any).specialization,
                hospital: (user as any).hospital,
            }
        });
    } catch (error: any) {
        console.error('Error logging in:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
