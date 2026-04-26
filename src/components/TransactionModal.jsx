import { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food','Travel','Shopping','Education','Health','Bills','Salary','Freelance','Other'];

const TransactionModal = ({ isOpen, onClose, transaction }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const isEdit = !!transaction;
  const [form, setForm] = useState({ title:'', amount:'', type:'expense', category:'Food', description:'', date:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (transaction) {
      setForm({ title: transaction.title, amount: transaction.amount, type: transaction.type,
        category: transaction.category, description: transaction.description || '',
        date: transaction.date?.split('T')[0] || '' });
    } else {
      setForm({ title:'', amount:'', type:'expense', category:'Food', description:'', date: new Date().toISOString().split('T')[0] });
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) return toast.error('Fill all required fields');
    setLoading(true);
    try {
      if (isEdit) { await updateTransaction(transaction._id, { ...form, amount: Number(form.amount) }); toast.success('Transaction updated'); }
      else { await addTransaction({ ...form, amount: Number(form.amount) }); toast.success('Transaction added'); }
      onClose();
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm">
      {/* Sheet on mobile, centered modal on sm+ */}
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up
        max-h-[92dvh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{isEdit ? 'Update the details below' : 'Fill in the details below'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 touch-manipulation">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 p-1 gap-1 bg-gray-50">
            {['expense','income'].map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2.5 text-sm font-semibold capitalize rounded-lg transition-all duration-200 touch-manipulation
                  ${form.type === t
                    ? t === 'expense'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                      : 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                    : 'text-gray-400 hover:text-gray-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              placeholder="e.g. Grocery shopping" autoFocus />
          </div>

          {/* Amount + Date — stack on xs, side-by-side on sm */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Amount *</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Note</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none"
              placeholder="Optional note..." />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
              text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-200 disabled:opacity-60 touch-manipulation">
            {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
