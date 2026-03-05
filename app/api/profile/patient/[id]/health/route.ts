import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EscalatedCase from '@/models/EscalatedCase';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const cases = await EscalatedCase.find({}).sort({ createdAt: -1 });
        const latestCase = cases.length > 0 ? cases[0] : null;

        return NextResponse.json({
            success: true,
            healthData: latestCase ? {
                caseId: latestCase._id.toString(),
                symptoms: latestCase.symptoms,
                triageLevel: latestCase.analysis?.triage_level || null,
                analysis: latestCase.analysis?.analysis || null,
                recommendedActions: latestCase.analysis?.recommended_actions || [],
                possibleConditions: latestCase.analysis?.possible_conditions || [],
                riskFactors: latestCase.analysis?.risk_factors || [],
                status: latestCase.status,
                escalatedAt: latestCase.escalatedAt,
            } : null,
            totalCases: cases.length,
        });
    } catch (error: any) {
        console.error('Error fetching patient health data:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
