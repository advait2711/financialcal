import React from 'react';
import { Calculator, PieChart, TrendingUp, Shield, Wallet, BarChart3 } from 'lucide-react';
import './Home.css';

function Home({ onSelectCalculator }) {
    return (
        <div className="home">
            {/* Header */}
            <header className="home-header">
                <div className="home-header-icon">
                    <TrendingUp className="icon" />
                </div>
                <h1 className="home-title">Financial Tools Suite</h1>
                <p className="home-subtitle">
                    Comprehensive tools to analyze your financial health and optimize your investment portfolio
                </p>
            </header>

            {/* Calculator Selection Cards */}
            <div className="calculator-cards">
                {/* Financial Health Calculator Card */}
                <div className="calculator-card" onClick={() => onSelectCalculator('financial')}>
                    <div className="card-icon financial">
                        <Calculator size={48} />
                    </div>
                    <div className="card-content">
                        <h2 className="card-title">Financial Health Calculator</h2>
                        <p className="card-description">
                            Assess your overall financial wellness with our comprehensive 6-point evaluation covering income,
                            expenses, emergency funds, debt, investments, and insurance.
                        </p>
                        <ul className="card-features">
                            <li><Shield size={18} /> Income Stability Analysis</li>
                            <li><Wallet size={18} /> Expense Management Score</li>
                            <li><TrendingUp size={18} /> Investment Evaluation</li>
                        </ul>
                    </div>
                    <div className="card-action">
                        <span className="card-btn">Get Started →</span>
                    </div>
                </div>

                {/* Investment Calculator Card */}
                <div className="calculator-card" onClick={() => onSelectCalculator('investment')}>
                    <div className="card-icon investment">
                        <PieChart size={48} />
                    </div>
                    <div className="card-content">
                        <h2 className="card-title">Wealth Portfolio Analyzer</h2>
                        <p className="card-description">
                            Analyze your portfolio allocation, discover your risk profile, and get personalized
                            recommendations for optimal asset distribution.
                        </p>
                        <ul className="card-features">
                            <li><PieChart size={18} /> Visual Portfolio Analysis</li>
                            <li><BarChart3 size={18} /> Risk Profile Detection</li>
                            <li><TrendingUp size={18} /> Surplus/Deficit Insights</li>
                        </ul>
                    </div>
                    <div className="card-action">
                        <span className="card-btn">Get Started →</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="home-features">
                <div className="feature-item">
                    <div className="feature-icon">
                        <Shield size={24} />
                    </div>
                    <div className="feature-text">
                        <h3>Privacy First</h3>
                        <p>All calculations happen locally. Your data never leaves your device.</p>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="feature-text">
                        <h3>Expert Insights</h3>
                        <p>Based on industry-standard financial planning principles.</p>
                    </div>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">
                        <BarChart3 size={24} />
                    </div>
                    <div className="feature-text">
                        <h3>Visual Reports</h3>
                        <p>Beautiful charts and clear recommendations for action.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
