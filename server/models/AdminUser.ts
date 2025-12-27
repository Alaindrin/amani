import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  password_hash: string;
  created_at: Date;
}

const AdminUserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

export default mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);