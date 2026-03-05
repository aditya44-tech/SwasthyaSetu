import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    role: 'asha' | 'doctor';
    contact?: string;
    location?: string;
    password?: string;
    // ASHA-specific
    ashaId?: string;
    // Doctor-specific
    licenseNumber?: string;
    specialization?: string;
    hospital?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['asha', 'doctor'], required: true },
    contact: { type: String },
    location: { type: String },
    password: { type: String },
    // ASHA-specific
    ashaId: { type: String },
    // Doctor-specific
    licenseNumber: { type: String },
    specialization: { type: String },
    hospital: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
