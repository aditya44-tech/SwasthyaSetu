import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAshaWorker extends Document {
    name: string;
    role: 'asha';
    contact?: string;
    location?: string;
    password?: string;
    ashaId?: string;
    createdAt: Date;
}

const AshaWorkerSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['asha'], default: 'asha' },
    contact: { type: String },
    location: { type: String },
    password: { type: String },
    ashaId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const AshaWorker: Model<IAshaWorker> = mongoose.models.AshaWorker || mongoose.model<IAshaWorker>('AshaWorker', AshaWorkerSchema);

export default AshaWorker;
