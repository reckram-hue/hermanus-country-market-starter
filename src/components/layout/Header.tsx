import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-4 sm:px-6">
      <div className="text-sm text-slate-600 font-medium">
        Hermanus Country Market • Admin
      </div>
      <div className="ml-auto text-sm text-slate-400">
        {new Date().toLocaleDateString('en-ZA', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        })}
      </div>
    </header>
  );
};

export default Header;
