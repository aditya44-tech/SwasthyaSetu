import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AshaWorker from '@/models/AshaWorker';
import Doctor from '@/models/Doctor';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { role, ...userData } = body;

        let newUser;

        if (role === 'asha') {
            newUser = await AshaWorker.create({
                name: userData.fullName,
                role: 'asha',
                contact: userData.phoneNumber,
                location: userData.area,
                password: userData.password,
                ashaId: userData.ashaId,
            });
        } else if (role === 'doctor') {
            newUser = await Doctor.create({
                name: userData.fullName,
                role: 'doctor',
                contact: userData.phoneNumber,
                location: userData.hospital,
                password: userData.password,
                licenseNumber: userData.licenseNumber,
                specialization: userData.specialization,
                hospital: userData.hospital,
            });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                role: newUser.role,
                contact: newUser.contact,
                location: newUser.location,
                ashaId: (newUser as any).ashaId,
                specialization: (newUser as any).specialization,
                hospital: (newUser as any).hospital,
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error registering user:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
