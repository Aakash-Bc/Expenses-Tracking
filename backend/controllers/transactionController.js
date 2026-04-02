import Transaction from '../models/Transaction.js';

// @desc  Get all transactions for logged-in user
export const getTransactions = async (req, res) => {
  const { type, category, startDate, endDate, search } = req.query;
  const filter = { userId: req.user._id };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (search) filter.title = { $regex: search, $options: 'i' };

  const transactions = await Transaction.find(filter).sort({ date: -1 });
  res.json(transactions);
};

// @desc  Create transaction
export const createTransaction = async (req, res) => {
  const { title, amount, type, category, description, date } = req.body;
  if (!title || !amount || !type || !category || !date)
    return res.status(400).json({ message: 'Required fields missing' });

  const transaction = await Transaction.create({
    userId: req.user._id,
    title,
    amount,
    type,
    category,
    description,
    date,
  });
  res.status(201).json(transaction);
};

// @desc  Update transaction
export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  if (transaction.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// @desc  Delete transaction
export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  if (transaction.userId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  await transaction.deleteOne();
  res.json({ message: 'Transaction removed' });
};

// @desc  Get summary stats
export const getSummary = async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category breakdown for expenses
  const categoryBreakdown = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

  // Monthly breakdown (last 6 months)
  const monthlyData = {};
  transactions.forEach((t) => {
    const key = `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 };
    monthlyData[key][t.type] += t.amount;
  });

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    categoryBreakdown,
    monthlyData,
  });
};
