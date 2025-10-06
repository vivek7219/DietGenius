
import React from 'react';
import { Tab } from '../types';
import PlannerIcon from './icons/PlannerIcon';
import CameraIcon from './icons/CameraIcon';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: Tab.DIET_PLANNER, label: 'Diet Planner', icon: <PlannerIcon /> },
    { id: Tab.FOOD_ANALYZER, label: 'Food Analyzer', icon: <CameraIcon /> },
  ];

  const getTabClass = (tabId: Tab) => {
    const baseClass = "flex-1 px-4 py-3 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center space-x-2";
    if (activeTab === tabId) {
      return `${baseClass} bg-primary text-white shadow-md`;
    }
    return `${baseClass} bg-gray-200 text-gray-600 hover:bg-gray-300`;
  };

  return (
    <div className="flex space-x-2 md:space-x-4 p-1 bg-gray-100 rounded-xl max-w-lg mx-auto">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={getTabClass(tab.id)}>
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
