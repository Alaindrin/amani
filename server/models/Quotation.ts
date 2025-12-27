import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotation extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  timeline?: string;
  description: string;
  status: 'pending' | 'reviewed' | 'responded';
  created_at: Date;
  updated_at: Date;
}

const QuotationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    project_type: { type: String, required: true },
    budget: { type: String },
    timeline: { type: String },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'responded'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default mongoose.model<IQuotation>('Quotation', QuotationSchema);