import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConsultation extends Document {
    caseId: mongoose.Types.ObjectId;
    patientName: string;
    roomName: string;
    status: 'active' | 'completed';
    notes: string;
    prescriptions: string;
    riskLevel: string;
    patientStatus: string;
    startedAt: Date;
    endedAt?: Date;
}

const ConsultationSchema: Schema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: 'EscalatedCase', required: true },
    patientName: { type: String, required: true },
    roomName: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    notes: { type: String, default: '' },
    prescriptions: { type: String, default: '' },
    riskLevel: { type: String, default: '' },
    patientStatus: { type: String, default: '' },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
}, {
    timestamps: true
});

const Consultation: Model<IConsultation> = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);

export default Consultation;
