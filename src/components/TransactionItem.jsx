import { Pencil, Trash2 } from 'lucide-react';

const CATEGORY_META = {
  Food:      { color: 'bg-orange-50 text-orange-600 border-orange-100' },
  Travel:    { color: 'bg-sky-50 text-sky-600 border-sky-100' },
  Shopping:  { color: 'bg-pink-50 text-pink-600 border-pink-100' },
  Education: { color: 'bg-purple-50 text-purple-600 border-purple-100' },
  Health:    { color: 'bg-green-50 text-green-600 border-green-100' },
  Bills:     { color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  Salary:    { color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Freelance: { color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  Other:     { color: 'bg-gray-50 text-gray-500 border-gray-100' },
};

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const meta = CATEGORY_META[transaction.category] || CATEGORY_META.Other;

  return (
    <div className="flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5 bg-white/80 rounded-2xl border border-white/60
      hover:border-violet-100 hover:shadow-md hover:shadow-violet-50 transition-all duration-200 group animate-fade-in">

      {/* Left: badge + info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <span className={`hidden xs:inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold border shrink-0 ${meta.color}`}>
          {transaction.category}
        </span>
        {/* On very small screens show a dot instead */}
        <span className={`xs:hidden w-2.5 h-2.5 rounded-full shrink-0 ${meta.color.split(' ')[0].replace('bg-', 'bg-').replace('50', '400')}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{transaction.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            <span className="xs:hidden">{transaction.category} · </span>
            {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: amount + actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`font-bold text-sm tabular-nums ${isIncome ? 'text-emerald-600' : 'text-rose-500'}`}>
          {isIncome ? '+' : '−'}NPR {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
        {/* Always visible on touch, hover-only on desktop */}
        <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          <button onClick={() => onEdit(transaction)}
            className="p-1.5 hover:bg-violet-50 rounded-lg transition-colors text-gray-300 hover:text-violet-600 touch-manipulation">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(transaction._id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-300 hover:text-red-500 touch-manipulation">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
