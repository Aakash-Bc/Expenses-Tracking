import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowLeftRight, BarChart2, LogOut, Wallet, X, Sparkles } from 'lucide-react';

const links = [
  { to: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions',  icon: ArrowLeftRight },
  { to: '/reports',      label: 'Reports',       icon: BarChart2 },
];

const Sidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-64 z-30
        bg-gradient-to-b from-[#1a0533] via-[#1e0a4a] to-[#0f0a2e]
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Wallet size={18} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight">ExpenseIQ</span>
              <div className="flex items-center gap-1">
                <Sparkles size={9} className="text-violet-400" />
                <span className="text-violet-400 text-[10px] font-medium tracking-widest uppercase">Finance</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20 shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate leading-tight">{user?.name}</p>
              <p className="text-white/40 text-xs truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex flex-col gap-1 flex-1">
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Menu</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-violet-600/80 to-indigo-600/60 text-white shadow-lg shadow-violet-900/40'
                  : 'text-white/50 hover:bg-white/6 hover:text-white/90'}`}>
              <div className={`p-1.5 rounded-lg transition-all`}>
                <Icon size={16} />
              </div>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 border-t border-white/8 pt-4">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium
              text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
            <div className="p-1.5 rounded-lg">
              <LogOut size={16} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
