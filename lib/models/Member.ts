import mongoose from 'mongoose';

const ContributionSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g. "2026-05"
  amount: { type: Number, required: true },
}, { _id: false, timestamps: true });

const MemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: false, unique: true, index: true, ref: 'User' },
  memberNumber: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true, index: true },
  contact: { type: String, required: true, unique: true, index: true },
  church: { type: String },
  contributions: {
    type: [ContributionSchema],
    validate: {
      validator: function(contributions:any) {
        const months = contributions.map((c:any) => c.month);
        return months.length === new Set(months).size; // ensure unique months
      },
      message: 'Duplicate month entries are not allowed',
    },
    default: [],
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
