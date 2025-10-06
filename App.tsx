
import React, { useState } from 'react';
import Tabs from './components/Tabs';
import DietPlanner from './components/DietPlanner';
import FoodAnalyzer from './components/FoodAnalyzer';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DIET_PLANNER);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center justify-center space-x-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.83 15.59L4.59 12l1.41-1.41L10.17 14.17l7.83-7.83 1.41 1.41L10.17 17z" opacity="0.4"/>
            <path d="M10.17 17L4.59 11.42l1.41-1.41L10.17 14.17l7.83-7.83 1.41 1.41z"/>
          </svg>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Diet <span className="text-primary">Genius</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-8">
          {activeTab === Tab.DIET_PLANNER ? <DietPlanner /> : <FoodAnalyzer />}
        </div>
      </main>
       <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by AI. Always consult with a healthcare professional for medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
