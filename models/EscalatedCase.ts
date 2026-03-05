import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEscalatedCase extends Document {
    patient: {
        fullName: string;
        age: string;
        gender: string;
        phoneNumber?: string;
        address?: string;
        pregnancyStatus?: string;
    };
    symptoms: string;
    analysis: {
        symptoms_en: string;
        analysis: string;
        triage_level: 'Low' | 'Medium' | 'High' | 'Critical';
        risk_factors: string[];
        recommended_actions: string[];
        suggested_specialty: string;
        possible_conditions: string[];
        recommended_action_summary: string;
        eligible_schemes: { name: string; description: string }[];
    };
    status: 'pending' | 'resolving' | 'resolved';
    escalatedAt: Date;
}

const EscalatedCaseSchema: Schema = new Schema({
    patient: {
        fullName: { type: String, required: true },
        age: { type: String, required: true },
        gender: { type: String, required: true },
        phoneNumber: { type: String },
        address: { type: String },
        pregnancyStatus: { type: String },
    },
    symptoms: { type: String, required: true },
    analysis: {
        symptoms_en: { type: String },
        analysis: { type: String },
        triage_level: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
        risk_factors: [{ type: String }],
        recommended_actions: [{ type: String }],
        suggested_specialty: { type: String },
        possible_conditions: [{ type: String }],
        recommended_action_summary: { type: String },
        eligible_schemes: [{
            name: { type: String },
            description: { type: String }
        }],
    },
    status: { type: String, enum: ['pending', 'resolving', 'resolved'], default: 'pending' },
    escalatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

const EscalatedCase: Model<IEscalatedCase> = mongoose.models.EscalatedCase || mongoose.model<IEscalatedCase>('EscalatedCase', EscalatedCaseSchema);

export default EscalatedCase;
