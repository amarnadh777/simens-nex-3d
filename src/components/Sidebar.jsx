'use client';
import React, { useState } from 'react';
import { 
  LayoutGrid, Activity, Shield, Database, 
  Settings, Menu, X, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItem = ({ icon: Icon, label, href, active, isOpen }) => (
  <Link href={href} className="block">
    <div className={`
      flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group
      ${active 
        ? 'bg-blue-600/20 border border-blue-500/40 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
        : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}
    `}>
      <Icon size={22} className={active ? 'text-blue-400' : 'group-hover:text-blue-400'} />
      {isOpen && (
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  </Link>
);

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={`
        h-full bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/5 
        transition-all duration-500 ease-in-out flex flex-col p-4 z-50
        ${isOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* HAMBURGER / LOGO SECTION */}
      <div className={`flex items-center mb-10 ${isOpen ? 'justify-between px-2' : 'justify-center'}`}>
        {isOpen && <h1 className="text-sm font-black italic tracking-tighter text-blue-400">NEXUS_OS</h1>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex flex-col gap-3 flex-1">
        <NavItem icon={LayoutGrid} label="Overview" href="/" active={pathname === '/'} isOpen={isOpen} />
        <NavItem icon={Activity} label="Analytics" href="/AnalyticsPage" active={pathname === '/AnalyticsPage'} isOpen={isOpen} />
        <NavItem icon={Database} label="Storage" href="/storage" active={pathname === '/storage'} isOpen={isOpen} />
        <NavItem icon={Shield} label="Security" href="/security" active={pathname === '/security'} isOpen={isOpen} />
      </nav>

      {/* FOOTER SETTINGS */}
      <div className="pt-4 border-t border-white/5">
        <NavItem icon={Settings} label="Settings" href="/settings" active={pathname === '/settings'} isOpen={isOpen} />
      </div>
    </aside>
  );
}