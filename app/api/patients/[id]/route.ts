import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import EscalatedCase from '@/models/EscalatedCase';
import PatientHistory from '@/models/PatientHistory';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const resolvedParams = await params;
        const patientId = resolvedParams.id;

        if (!patientId) {
            return NextResponse.json({ success: false, error: 'Patient ID is required' }, { status: 400 });
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        // Delete associated records if they exist
        // Note: EscalatedCase stores patient info as a nested object, PatientHistory stores patientName
        if (patient.fullName) {
            await EscalatedCase.deleteMany({ 'patient.fullName': patient.fullName });
            await PatientHistory.deleteMany({ patientName: patient.fullName });
        }

        // Delete the patient record
        await Patient.findByIdAndDelete(patientId);

        return NextResponse.json({ success: true, message: 'Patient deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting patient:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
