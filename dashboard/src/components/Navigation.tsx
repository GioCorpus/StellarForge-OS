import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Cpu, Zap, Settings } from 'lucide-react';

// STELLARFORGE: Navigation component for Dyson Swarm control interface
export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/quantum', label: 'Quantum Control', icon: Cpu },
    { path: '/swarm', label: 'Swarm Status', icon: Zap },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-2 py-4 px-3 border-b-2 transition-all duration-200
                  ${active 
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
