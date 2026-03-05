import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PatientHistory from '@/models/PatientHistory';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        await dbConnect();
        const { name } = await params;
        const decodedName = decodeURIComponent(name);

        const history = await PatientHistory.find({ patientName: decodedName }).sort({ resolvedAt: -1 });

        return NextResponse.json({
            success: true,
            history: history.map(h => ({
                id: h._id.toString(),
                symptoms: h.symptoms,
                triageLevel: h.triageLevel,
                analysis: h.analysis,
                recommendedActions: h.recommendedActions,
                possibleConditions: h.possibleConditions,
                riskFactors: h.riskFactors,
                suggestedSpecialty: h.suggestedSpecialty,
                resolvedAt: h.resolvedAt,
                escalatedAt: h.escalatedAt,
            })),
        });
    } catch (error: any) {
        console.error('Error fetching patient history:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
