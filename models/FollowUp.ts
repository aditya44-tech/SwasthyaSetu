import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFollowUp extends Document {
    patientName: string;
    patientId?: mongoose.Types.ObjectId;
    symptoms: string;
    triageLevel: string;
    scheduledDate: string;
    createdAt: Date;
}

const FollowUpSchema: Schema = new Schema({
    patientName: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    symptoms: { type: String, required: true },
    triageLevel: { type: String, required: true },
    scheduledDate: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const FollowUp: Model<IFollowUp> = mongoose.models.FollowUp || mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);

export default FollowUp;
