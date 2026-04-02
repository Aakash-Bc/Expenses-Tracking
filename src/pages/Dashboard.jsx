import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import TransactionModal from '../components/TransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const COLORS = ['#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#06b6d4','#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-xs font-medium">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: NPR {p.value?.toLocaleString('en-IN')}</p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const { transactions, summary, loading, deleteTransaction } = useTransactions();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleEdit = (tx) => { setEditTx(tx); setModalOpen(true); };
  const handleDelete = async () => {
    try { await deleteTransaction(deleteId); toast.success('Transaction deleted'); }
    catch { toast.error('Failed to delete'); }
    setDeleteId(null);
  };

  const categoryData = summary?.categoryBreakdown
    ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  const monthlyData = summary?.monthlyData
    ? Object.entries(summary.monthlyData).map(([month, data]) => ({ month, income: data.income, expense: data.expense })).slice(-6)
    : [];

  // Current month totals
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const currentMonth = summary?.monthlyData?.[currentMonthKey] || { income: 0, expense: 0 };
  const monthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  if (loading && !summary) return <Spinner />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Greeting row — wraps on mobile */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-gray-400 text-sm font-medium">{greeting},</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {user?.name?.split(' ')[0]} 👋
          </h2>
        </div>
        <button onClick={() => { setEditTx(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold
            transition-all shadow-lg shadow-violet-200 touch-manipulation whitespace-nowrap">
          <Plus size={15} />
          <span className="hidden xs:inline">Add Transaction</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Stats — 1 col on xs, 2 on sm, 3 on md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 stagger">
        <StatCard title="Total Income" amount={summary?.totalIncome || 0}
          color="bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-200"
          icon={<TrendingUp size={18} />} />
        <StatCard title="Total Expenses" amount={summary?.totalExpense || 0}
          color="bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-200"
          icon={<TrendingDown size={18} />} />
        {/* Balance spans full width on sm (2-col), normal on md (3-col) */}
        <div className="sm:col-span-2 md:col-span-1">
          <StatCard title="Net Balance" amount={summary?.balance || 0}
            color="bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-200"
            icon={<Wallet size={18} />} />
        </div>
      </div>

      {/* Monthly Summary — this month's income & expense */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* This month income */}
        <div className="card rounded-2xl p-4 sm:p-5 border border-white/70 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Income this month</p>
            <p className="text-lg sm:text-xl font-extrabold text-emerald-600 tracking-tight mt-0.5">
              NPR {currentMonth.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{monthName}</p>
          </div>
        </div>

        {/* This month expense */}
        <div className="card rounded-2xl p-4 sm:p-5 border border-white/70 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <TrendingDown size={20} className="text-rose-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expense this month</p>
            <p className="text-lg sm:text-xl font-extrabold text-rose-500 tracking-tight mt-0.5">
              NPR {currentMonth.expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{monthName}</p>
          </div>
        </div>
      </div>

      {/* Charts — stack on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="card rounded-2xl p-4 sm:p-6 shadow-sm border border-white/70">
          <div className="mb-4">
            <h3 className="text-gray-900 font-bold text-sm sm:text-base">Expense Breakdown</h3>
            <p className="text-gray-400 text-xs mt-0.5">By category</p>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75} paddingAngle={3}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-2">
                <TrendingDown size={18} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No expense data yet</p>
            </div>
          )}
        </div>

        <div className="card rounded-2xl p-4 sm:p-6 shadow-sm border border-white/70">
          <div className="mb-4">
            <h3 className="text-gray-900 font-bold text-sm sm:text-base">Monthly Trends</h3>
            <p className="text-gray-400 text-xs mt-0.5">Last 6 months</p>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-2">
                <TrendingUp size={18} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No monthly data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card rounded-2xl p-4 sm:p-6 shadow-sm border border-white/70">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 font-bold text-sm sm:text-base">Recent Transactions</h3>
            <p className="text-gray-400 text-xs mt-0.5">Your latest activity</p>
          </div>
          <Link to="/transactions"
            className="flex items-center gap-1 text-violet-600 hover:text-violet-700 text-xs font-semibold transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <TransactionItem key={tx._id} transaction={tx} onEdit={handleEdit} onDelete={setDeleteId} />
          ))}
          {transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center mb-2">
                <Wallet size={18} className="text-violet-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No transactions yet</p>
              <p className="text-gray-300 text-xs mt-1">Tap "Add" to get started</p>
            </div>
          )}
        </div>
      </div>

      <TransactionModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} transaction={editTx} />
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default Dashboard;
