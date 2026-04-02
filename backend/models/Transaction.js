import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: ['Food', 'Travel', 'Shopping', 'Education', 'Health', 'Bills', 'Salary', 'Freelance', 'Other'],
      required: true,
    },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
