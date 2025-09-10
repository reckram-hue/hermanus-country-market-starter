import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/shared/Card';
import TradingDaysPage from './TradingDays/TradingDaysPage';

const TABS = ['Trading Days', 'Traders', 'Bookings', 'Billing', 'Reports', 'Settings', 'Messages'];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Trading Days');

  const renderContent = () => {
    if (activeTab === 'Trading Days') return <TradingDaysPage />;

    // placeholders for other tabs
    return (
      <Card title={activeTab}>
        <p className="text-slate-600">
          This is a placeholder for the <strong>{activeTab}</strong> module. We’ll plug in real screens
          step-by-step after your confirmation.
        </p>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <nav className="w-60 bg-white border-r border-slate-200/80 flex flex-col">
        <div className="p-6 border-b border-slate-200/80">
          <h2 className="text-xl font-bold text-sky-600">Admin Console</h2>
        </div>
        <ul className="flex-grow pt-2">
          {TABS.map((tab) => (
            <li key={tab} className="px-3">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  activeTab === tab
                    ? 'bg-sky-100 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
