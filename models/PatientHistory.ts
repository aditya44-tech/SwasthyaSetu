import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatientHistory extends Document {
    patientName: string;
    patientAge: string;
    patientGender: string;
    symptoms: string;
    triageLevel: string;
    analysis: string;
    recommendedActions: string[];
    possibleConditions: string[];
    riskFactors: string[];
    suggestedSpecialty: string;
    resolvedAt: Date;
    escalatedAt: Date;
    originalCaseId: string;
}

const PatientHistorySchema: Schema = new Schema({
    patientName: { type: String, required: true },
    patientAge: { type: String },
    patientGender: { type: String },
    symptoms: { type: String, required: true },
    triageLevel: { type: String },
    analysis: { type: String },
    recommendedActions: [{ type: String }],
    possibleConditions: [{ type: String }],
    riskFactors: [{ type: String }],
    suggestedSpecialty: { type: String },
    resolvedAt: { type: Date, default: Date.now },
    escalatedAt: { type: Date },
    originalCaseId: { type: String },
}, {
    timestamps: true
});

const PatientHistory: Model<IPatientHistory> = mongoose.models.PatientHistory || mongoose.model<IPatientHistory>('PatientHistory', PatientHistorySchema);

export default PatientHistory;
