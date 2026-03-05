import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EscalatedCase from '@/models/EscalatedCase';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        const newCase = await EscalatedCase.create(body);

        return NextResponse.json({ success: true, data: newCase }, { status: 201 });
    } catch (error: any) {
        console.error('Error escalating case:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to escalate case' }, { status: 500 });
    }
}
