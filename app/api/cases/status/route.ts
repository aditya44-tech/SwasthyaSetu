import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EscalatedCase from '@/models/EscalatedCase';
import PatientHistory from '@/models/PatientHistory';

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { caseId, status } = body;

        if (!caseId || !status) {
            return NextResponse.json({ success: false, error: 'caseId and status are required' }, { status: 400 });
        }

        const validStatuses = ['pending', 'resolving', 'resolved'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ success: false, error: 'Invalid status. Must be: pending, resolving, or resolved' }, { status: 400 });
        }

        const existingCase = await EscalatedCase.findById(caseId);
        if (!existingCase) {
            return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
        }

        // If marking as resolved, archive the case to history before updating
        if (status === 'resolved' && existingCase.status !== 'resolved') {
            await PatientHistory.create({
                patientName: existingCase.patient.fullName,
                patientAge: existingCase.patient.age,
                patientGender: existingCase.patient.gender,
                symptoms: existingCase.symptoms,
                triageLevel: existingCase.analysis?.triage_level,
                analysis: existingCase.analysis?.analysis,
                recommendedActions: existingCase.analysis?.recommended_actions || [],
                possibleConditions: existingCase.analysis?.possible_conditions || [],
                riskFactors: existingCase.analysis?.risk_factors || [],
                suggestedSpecialty: existingCase.analysis?.suggested_specialty,
                escalatedAt: existingCase.escalatedAt,
                resolvedAt: new Date(),
                originalCaseId: existingCase._id.toString(),
            });

            // Delete the active case so patient can create new reports
            await EscalatedCase.findByIdAndDelete(caseId);

            return NextResponse.json({ success: true, archived: true, message: 'Case resolved and archived to history.' });
        }

        // For non-resolved statuses, just update
        const updatedCase = await EscalatedCase.findByIdAndUpdate(
            caseId,
            { status },
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedCase });
    } catch (error: any) {
        console.error('Error updating case status:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
