import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { role, ...userData } = body;

        const newUser = await User.create({
            name: userData.fullName,
            role,
            contact: userData.phoneNumber,
            location: role === 'asha' ? userData.area : userData.hospital,
            password: userData.password,
            ashaId: userData.ashaId,
            licenseNumber: userData.licenseNumber,
            specialization: userData.specialization,
            hospital: userData.hospital,
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                role: newUser.role,
                contact: newUser.contact,
                location: newUser.location,
                ashaId: newUser.ashaId,
                specialization: newUser.specialization,
                hospital: newUser.hospital,
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error registering user:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
