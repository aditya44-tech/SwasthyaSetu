import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatient extends Document {
    fullName: string;
    age: string;
    gender: string;
    phoneNumber?: string;
    address?: string;
    pregnancyStatus?: string;
    ashaId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const PatientSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    pregnancyStatus: { type: String },
    ashaId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);

export default Patient;
