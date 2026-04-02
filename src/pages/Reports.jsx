import { useTransactions } from '../context/TransactionContext';
import Spinner from '../components/Spinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';

const COLORS = ['#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#06b6d4','#84cc16','#a78bfa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-xs font-medium">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: NPR {p.value?.toLocaleString('en-IN')}</p>)}
    </div>
  );
};

const Reports = () => {
  const { summary, transactions, loading } = useTransactions();
  if (loading && !summary) return <Spinner />;

  const categoryData = summary?.categoryBreakdown
    ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({ name, value })) : [];

  const monthlyData = summary?.monthlyData
    ? Object.entries(summary.monthlyData)
        .map(([month, data]) => ({ month, income: data.income, expense: data.expense, net: data.income - data.expense }))
        .sort((a, b) => a.month.localeCompare(b.month)) : [];

  const handleExport = () => {
    const headers = ['Title','Amount','Type','Category','Date','Description'];
    const rows = transactions.map((t) => [t.title, t.amount, t.type, t.category, new Date(t.date).toLocaleDateString(), t.description || '']);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Total Income',   value: summary?.totalIncome  || 0, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Total Expenses', value: summary?.totalExpense || 0, color: 'text-rose-500',    bg: 'bg-rose-50 border-rose-100' },
          { label: 'Net Balance',    value: summary?.balance      || 0, color: 'text-violet-600',  bg: 'bg-violet-50 border-violet-100' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 sm:p-5 border`}>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-xl sm:text-2xl font-extrabold tracking-tight ${color}`}>
              NPR {value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-4">Expense Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No expense data</p>}
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-4">Monthly Income vs Expense</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-12">No data</p>}
        </div>
      </div>

      {/* Net trend */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-gray-900 font-bold text-sm sm:text-base">Net Balance Trend</h3>
            <p className="text-gray-400 text-xs mt-0.5">Monthly net over time</p>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold
              transition-all shadow-md shadow-violet-200 touch-manipulation">
            <Download size={14} /> Export CSV
          </button>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="net" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="text-gray-400 text-sm text-center py-10">No data</p>}
      </div>
    </div>
  );
};

export default Reports;
