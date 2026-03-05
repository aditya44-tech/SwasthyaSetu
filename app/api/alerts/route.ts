import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Alert from '@/models/Alert';

export async function GET() {
    try {
        await dbConnect();
        const alerts = await Alert.find({}).sort({ createdAt: -1 });
        const formattedAlerts = alerts.map(a => ({
            id: a._id.toString(),
            patientName: a.patientName,
            patientId: a.patientId?.toString() || null,
            riskLevel: a.riskLevel,
            condition: a.condition,
            date: a.date
        }));
        return NextResponse.json({ success: true, alerts: formattedAlerts });
    } catch (error: any) {
        console.error('Error fetching alerts:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const newAlert = await Alert.create(body);
        return NextResponse.json({ success: true, data: newAlert }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating alert:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await dbConnect();
        await Alert.deleteMany({}); // Clears all alerts from the dashboard
        return NextResponse.json({ success: true, message: 'All alerts cleared' });
    } catch (error: any) {
        console.error('Error clearing alerts:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
