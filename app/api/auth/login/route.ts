import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { phone, password, role } = body;

        // Find user by contact and role
        const user = await User.findOne({ contact: phone, role });

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
                ashaId: user.ashaId,
                specialization: user.specialization,
                hospital: user.hospital,
            }
        });
    } catch (error: any) {
        console.error('Error logging in:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
