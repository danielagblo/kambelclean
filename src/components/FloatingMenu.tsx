'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, GraduationCap, Mail, Info } from 'lucide-react';

export default function FloatingMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: '/landing', label: 'Home', icon: Home },
    { path: '/publications', label: 'Publications', icon: BookOpen },
    { path: '/blog', label: 'Blog', icon: FileText },
    { path: '/masterclasses', label: 'Masterclasses', icon: GraduationCap },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-2 backdrop-blur-sm border border-gray-100 overflow-x-auto max-w-[95vw]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/landing' && pathname === '/');
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center gap-1 group p-2 rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:shadow-lg min-w-[60px] ${
                isActive ? 'bg-blue-50' : ''
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-blue-600' : 'text-gray-700'
              }`} />
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-600' : 'text-gray-700'
              } group-hover:text-blue-600`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
