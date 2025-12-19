import React, { useState } from 'react';
import './App.css';
import Home from './Home';
import FinancialHealthCalculator from './FinancialHealthCalculator';
import InvestmentCalculator from './InvestmentCalculator';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleSelectCalculator = (calculator) => {
    setCurrentView(calculator);
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  return (
    <div className="app">
      <div className="container">
        {currentView === 'home' && (
          <Home onSelectCalculator={handleSelectCalculator} />
        )}
        {currentView === 'financial' && (
          <FinancialHealthCalculator onBack={handleBack} />
        )}
        {currentView === 'investment' && (
          <InvestmentCalculator onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

export default App;