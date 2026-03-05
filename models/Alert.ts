import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlert extends Document {
    patientName: string;
    patientId?: mongoose.Types.ObjectId;
    riskLevel: 'Medium' | 'High' | 'Critical';
    condition: string;
    date: string;
    createdAt: Date;
}

const AlertSchema: Schema = new Schema({
    patientName: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    riskLevel: { type: String, enum: ['Medium', 'High', 'Critical'], required: true },
    condition: { type: String, required: true },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Alert: Model<IAlert> = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);

export default Alert;
