import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDoctor extends Document {
    name: string;
    role: 'doctor';
    contact?: string;
    location?: string;
    password?: string;
    licenseNumber?: string;
    specialization?: string;
    hospital?: string;
    createdAt: Date;
}

const DoctorSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['doctor'], default: 'doctor' },
    contact: { type: String },
    location: { type: String },
    password: { type: String },
    licenseNumber: { type: String },
    specialization: { type: String },
    hospital: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export default Doctor;
