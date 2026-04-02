const StatCard = ({ title, amount, icon, color, sub }) => {
  return (
    <div className={`rounded-2xl p-6 text-white shadow-xl ${color} relative overflow-hidden group cursor-default animate-fade-in`}>
      {/* Decorative blobs */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/8 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent rounded-b-2xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="text-white/75 text-xs font-semibold uppercase tracking-widest">{title}</span>
          <div className="p-2.5 bg-white/20 rounded-xl shadow-inner backdrop-blur-sm">{icon}</div>
        </div>
        <p className="text-3xl font-extrabold tracking-tight">
          NPR {typeof amount === 'number' ? amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
        </p>
        {sub && <p className="text-white/60 text-xs mt-1.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
