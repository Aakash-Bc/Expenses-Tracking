import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionItem from '../components/TransactionItem';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import { Plus, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All','Food','Travel','Shopping','Education','Health','Bills','Salary','Freelance','Other'];

const Transactions = () => {
  const { transactions, loading, deleteTransaction, fetchTransactions } = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleEdit = (tx) => { setEditTx(tx); setModalOpen(true); };
  const handleDelete = async () => {
    try { await deleteTransaction(deleteId); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
    setDeleteId(null);
  };

  const handleFilter = () => {
    fetchTransactions({
      search,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      category: categoryFilter !== 'All' ? categoryFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setSearch(''); setTypeFilter('all'); setCategoryFilter('All'); setStartDate(''); setEndDate('');
    fetchTransactions({});
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">

      {/* Filters card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Filter header — always visible, tap to expand on mobile */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-4 sm:hidden touch-manipulation">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-violet-500" />
            <span className="text-sm font-semibold text-gray-700">Filters</span>
          </div>
          {filtersOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>

        {/* Always open on sm+, collapsible on mobile */}
        <div className={`px-4 sm:px-5 pb-4 sm:pt-5 ${filtersOpen ? 'block' : 'hidden sm:block'}`}>
          <div className="hidden sm:flex items-center gap-2 mb-4">
            <Filter size={15} className="text-violet-500" />
            <span className="text-sm font-semibold text-gray-700">Filters</span>
          </div>

          {/* Search — full width on mobile */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
          </div>

          {/* Type + Category — side by side */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent">
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Date range — stacked on xs, side by side on sm */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">From</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">To</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleFilter}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-violet-200 touch-manipulation">
              Apply
            </button>
            <button onClick={handleReset}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-colors touch-manipulation">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 font-bold text-sm sm:text-base">All Transactions</h3>
            <p className="text-gray-400 text-xs mt-0.5">{transactions.length} record{transactions.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => { setEditTx(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold
              transition-all shadow-md shadow-violet-200 touch-manipulation">
            <Plus size={15} />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>

        {loading ? <Spinner /> : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <TransactionItem key={tx._id} transaction={tx} onEdit={handleEdit} onDelete={setDeleteId} />
            ))}
            {transactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center mb-2">
                  <Search size={18} className="text-violet-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">No transactions found</p>
                <p className="text-gray-300 text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      <TransactionModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} transaction={editTx} />
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default Transactions;
