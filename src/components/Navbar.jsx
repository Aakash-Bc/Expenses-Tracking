import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/60 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm shadow-violet-100/30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-gray-900 font-bold text-lg leading-tight tracking-tight">{title}</h1>
          <p className="text-gray-400 text-xs hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-violet-200 ml-1">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
