import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. CREATE, UPDATE, DELETE
  entity: { type: String, required: true }, // e.g. Member, Contribution
  entityId: { type: String },
  performedBy: { type: String }, // admin email
  changes: { type: Object }, // snapshot of changes
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
