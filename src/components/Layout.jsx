import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/reports': 'Reports & Analytics',
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'ExpenseIQ';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        {/* Decorative background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" style={{ left: 'var(--sidebar-w, 256px)' }}>
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/40 to-indigo-50/60" />
          {/* Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-indigo-200/25 blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-fuchsia-200/20 blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-56 h-56 rounded-full bg-sky-200/20 blur-3xl" />
          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'radial-gradient(circle, #6d28d9 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>
        {/* p-4 on mobile, p-6 on md+ */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
