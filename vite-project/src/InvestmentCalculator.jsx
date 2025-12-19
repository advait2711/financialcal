import React, { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { jsPDF } from 'jspdf';
import {
    TrendingUp,
    PieChart,
    ArrowUp,
    ArrowDown,
    AlertCircle,
    CheckCircle,
    Briefcase,
    Building2,
    Coins,
    Banknote,
    Wallet,
    Download
} from 'lucide-react';
import './InvestmentCalculator.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Ideal allocation based on general investment principles
// Equity: 40-60% (using 50% midpoint)
// Debt: 20-35% (using 27.5% midpoint)
// Gold: 5-10% (using 7.5% midpoint)
// REIT: 5-10% (using 7.5% midpoint)  
// Cash: 5%
const IDEAL_ALLOCATION = {
    equity: 50,
    debt: 27.5,
    gold: 7.5,
    reit: 7.5,
    cash: 5,
};

const IDEAL_RANGES = {
    equity: { min: 40, max: 60, label: '40-60%' },
    debt: { min: 20, max: 35, label: '20-35%' },
    gold: { min: 5, max: 10, label: '5-10%' },
    reit: { min: 5, max: 10, label: '5-10%' },
    cash: { min: 5, max: 5, label: '5%' },
};

const ASSET_INFO = {
    equity: { label: 'Equities (Stocks/Mutual Funds)', icon: TrendingUp, color: '#6366f1', purpose: 'Growth & beating inflation' },
    debt: { label: 'Debt (Bonds/FD/PF)', icon: Banknote, color: '#ec4899', purpose: 'Stability & income' },
    gold: { label: 'Gold/Precious Metals', icon: Coins, color: '#f59e0b', purpose: 'Hedge against inflation & crisis' },
    reit: { label: 'Real Estate/REITs', icon: Building2, color: '#14b8a6', purpose: 'Long-term wealth & income' },
    cash: { label: 'Cash & Cash Equivalents', icon: Wallet, color: '#8b5cf6', purpose: 'Liquidity for emergencies' },
};

function InvestmentCalculator({ onBack }) {
    const [investments, setInvestments] = useState({
        equity: '',
        debt: '',
        gold: '',
        reit: '',
        cash: '',
    });
    const [showResults, setShowResults] = useState(false);

    const handleInvestmentChange = (key, value) => {
        setInvestments(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const calculateResults = () => {
        setShowResults(true);
    };

    const resetCalculator = () => {
        setInvestments({
            equity: '',
            debt: '',
            gold: '',
            reit: '',
            cash: '',
        });
        setShowResults(false);
    };

    // Calculate total portfolio from sum of all investments
    const totalPortfolio = useMemo(() => {
        return Object.values(investments).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    }, [investments]);

    // Calculate user's allocation percentages
    const userAllocations = useMemo(() => {
        if (totalPortfolio === 0) return { equity: 0, debt: 0, gold: 0, reit: 0, cash: 0 };

        return {
            equity: ((parseFloat(investments.equity) || 0) / totalPortfolio) * 100,
            debt: ((parseFloat(investments.debt) || 0) / totalPortfolio) * 100,
            gold: ((parseFloat(investments.gold) || 0) / totalPortfolio) * 100,
            reit: ((parseFloat(investments.reit) || 0) / totalPortfolio) * 100,
            cash: ((parseFloat(investments.cash) || 0) / totalPortfolio) * 100,
        };
    }, [totalPortfolio, investments]);

    // Determine risk type based on user's equity allocation
    const determineRiskType = useMemo(() => {
        const equityPercent = userAllocations.equity;

        if (equityPercent >= 55) return 'aggressive';
        if (equityPercent >= 40) return 'moderate';
        return 'conservative';
    }, [userAllocations]);

    const getRiskLabel = () => {
        const labels = {
            conservative: { text: 'Conservative', color: '#10b981', emoji: '🛡️' },
            moderate: { text: 'Moderate', color: '#f59e0b', emoji: '⚖️' },
            aggressive: { text: 'Aggressive', color: '#ef4444', emoji: '🚀' },
        };
        return labels[determineRiskType];
    };

    // Calculate surplus/deficit compared to ideal allocation
    const getSurplusDeficit = useMemo(() => {
        const results = {};

        Object.keys(IDEAL_ALLOCATION).forEach(key => {
            const diff = userAllocations[key] - IDEAL_ALLOCATION[key];
            results[key] = {
                ideal: IDEAL_ALLOCATION[key],
                actual: userAllocations[key],
                difference: diff,
                status: diff > 2 ? 'surplus' : diff < -2 ? 'deficit' : 'balanced',
                amount: totalPortfolio * (diff / 100),
                range: IDEAL_RANGES[key],
            };
        });

        return results;
    }, [userAllocations, totalPortfolio]);

    // Generate and download PDF report with charts
    const downloadReport = async () => {
        try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            let yPos = 45;

            // Header Section
            doc.setFillColor(99, 102, 241);
            doc.rect(0, 0, pageWidth, 35, 'F');
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('Wealth Portfolio Analysis', margin, 18);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | Currency: INR (Rs.)`, margin, 28);

            // Summary Section
            doc.setFillColor(245, 247, 250);
            doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 2, 2, 'F');
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.text(`Total Investment: Rs. ${totalPortfolio.toLocaleString()}`, margin + 5, yPos + 10);
            doc.text(`Risk Profile: ${getRiskLabel().text} Investor`, margin + 5, yPos + 18);

            yPos += 35;

            // Capture and Add Large Charts
            const { default: html2canvas } = await import('html2canvas');
            const charts = document.querySelectorAll('.chart-box canvas');
            if (charts.length >= 2) {
                const canvas1 = await html2canvas(charts[0], { scale: 3, backgroundColor: '#ffffff' });
                const canvas2 = await html2canvas(charts[1], { scale: 3, backgroundColor: '#ffffff' });

                // Increased width for larger display
                const chartW = 88;
                const chartH = (canvas1.height * chartW) / canvas1.width;

                doc.setFontSize(12);
                doc.text('Your Current Portfolio', margin + (chartW / 2), yPos - 5, { align: 'center' });
                doc.addImage(canvas1.toDataURL('image/png'), 'PNG', margin, yPos, chartW, chartH);

                doc.text('Ideal Portfolio', (pageWidth / 2 + 2) + (chartW / 2), yPos - 5, { align: 'center' });
                doc.addImage(canvas2.toDataURL('image/png'), 'PNG', pageWidth / 2 + 2, yPos, chartW, chartH);
                yPos += chartH + 20;
            }

            // Action Table with Colored Status
            doc.setFillColor(99, 102, 241);
            doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);

            const cols = { asset: margin + 3, actual: margin + 50, target: margin + 75, status: margin + 100, action: margin + 130 };
            doc.text('ASSET CLASS', cols.asset, yPos + 6.5);
            doc.text('ACTUAL', cols.actual, yPos + 6.5);
            doc.text('TARGET', cols.target, yPos + 6.5);
            doc.text('STATUS', cols.status, yPos + 6.5);
            doc.text('ACTION REQUIRED (Rs.)', cols.action, yPos + 6.5);

            yPos += 10;
            doc.setFont('helvetica', 'normal');

            Object.entries(getSurplusDeficit).forEach(([key, data], index) => {
                if (index % 2 === 0) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
                }
                doc.setTextColor(30, 41, 59);
                const info = ASSET_INFO[key];
                doc.text(info.label.split('(')[0].trim(), cols.asset, yPos + 6.5);
                doc.text(`${data.actual.toFixed(1)}%`, cols.actual, yPos + 6.5);
                doc.text(`${data.ideal}%`, cols.target, yPos + 6.5);

                // Status Colors
                if (data.status === 'surplus') doc.setTextColor(180, 83, 9);
                else if (data.status === 'deficit') doc.setTextColor(220, 38, 38);
                else doc.setTextColor(16, 185, 129);

                doc.text(data.status.toUpperCase(), cols.status, yPos + 6.5);

                doc.setTextColor(30, 41, 59);
                const actionAmt = data.status === 'balanced' ? 'Maintain' : Math.abs(Math.round(data.amount)).toLocaleString();
                doc.text(actionAmt, cols.action, yPos + 6.5);
                yPos += 10;
            });

            doc.save(`Portfolio_Analysis_Report.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
        }
    };

    // Chart data for user's portfolio with percentages
    const userChartData = {
        labels: Object.values(ASSET_INFO).map(a => a.label.split('(')[0].trim()),
        datasets: [
            {
                data: Object.keys(ASSET_INFO).map(key => parseFloat(investments[key]) || 0),
                backgroundColor: Object.values(ASSET_INFO).map(a => a.color),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 10,
            },
        ],
    };

    // Chart data for ideal portfolio
    const idealChartData = {
        labels: Object.values(ASSET_INFO).map(a => a.label.split('(')[0].trim()),
        datasets: [
            {
                data: Object.values(IDEAL_ALLOCATION),
                backgroundColor: Object.values(ASSET_INFO).map(a => a.color),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverOffset: 10,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0.65,
        layout: {
            padding: {
                top: 60,
                bottom: 60,
                left: 60,
                right: 60,
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'Poppins',
                        size: 12,
                        weight: '500',
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: {
                    family: 'Poppins',
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    family: 'Poppins',
                    size: 13,
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `₹${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
            datalabels: {
                color: '#1f2937',
                font: {
                    family: 'Poppins',
                    size: 11,
                    weight: '700',
                },
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    if (total === 0 || value === 0) return '';
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`;
                },
                anchor: 'end',
                align: 'end',
                offset: 12,
                clip: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                padding: {
                    top: 3,
                    bottom: 3,
                    left: 5,
                    right: 5,
                },
            },
        },
    };

    const idealChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0.65,
        layout: {
            padding: {
                top: 60,
                bottom: 60,
                left: 60,
                right: 60,
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'Poppins',
                        size: 12,
                        weight: '500',
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: {
                    family: 'Poppins',
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    family: 'Poppins',
                    size: 13,
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed}%`;
                    },
                },
            },
            datalabels: {
                color: '#1f2937',
                font: {
                    family: 'Poppins',
                    size: 11,
                    weight: '700',
                },
                formatter: (value) => {
                    return value > 0 ? `${value}%` : '';
                },
                anchor: 'end',
                align: 'end',
                offset: 12,
                clip: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                padding: {
                    top: 3,
                    bottom: 3,
                    left: 5,
                    right: 5,
                },
            },
        },
    };

    const isPortfolioValid = totalPortfolio > 0;

    return (
        <div className="investment-calculator">
            {/* Header */}
            <header className="ic-header">
                <button className="back-btn" onClick={onBack}>
                    ← Back to Home
                </button>
                <div className="ic-header-content">
                    <div className="ic-header-icon">
                        <PieChart className="icon" />
                    </div>
                    <h1 className="ic-title">Wealth Portfolio Analyzer</h1>
                    <p className="ic-subtitle">
                        Analyze your portfolio allocation, discover your risk profile, and get personalized recommendations
                    </p>
                </div>
            </header>

            {/* Input Section */}
            <div className="ic-sections">
                {/* Asset Allocation Inputs */}
                {Object.entries(ASSET_INFO).map(([key, info]) => {
                    const Icon = info.icon;
                    return (
                        <section className="ic-section" key={key}>
                            <div className="ic-section-header">
                                <Icon className="ic-section-icon" style={{ color: info.color }} />
                                <div>
                                    <h2 className="ic-section-title">{info.label}</h2>
                                    <p className="ic-section-purpose">{info.purpose}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label">Investment Amount (₹)</label>
                                <input
                                    type="number"
                                    value={investments[key]}
                                    onChange={(e) => handleInvestmentChange(key, e.target.value)}
                                    placeholder="Enter amount"
                                    className="input"
                                />
                                {totalPortfolio > 0 && investments[key] && (
                                    <div className="allocation-preview">
                                        <span style={{ backgroundColor: info.color + '20', color: info.color }}>
                                            {((parseFloat(investments[key]) / totalPortfolio) * 100).toFixed(1)}% of portfolio
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Portfolio Summary - Shows total after entering values */}
            {totalPortfolio > 0 && (
                <div className="investment-summary">
                    <div className="summary-item">
                        <Briefcase className="summary-icon" />
                        <div>
                            <span className="summary-label">Total Portfolio Value</span>
                            <span className="summary-value">₹{totalPortfolio.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="actions">
                <button
                    className="btn-calculate"
                    onClick={calculateResults}
                    disabled={!isPortfolioValid}
                >
                    Analyze My Portfolio
                </button>
                {showResults && (
                    <button className="btn-reset" onClick={resetCalculator}>
                        Reset Calculator
                    </button>
                )}
            </div>

            {/* Results Section */}
            {showResults && isPortfolioValid && (
                <div className="ic-results">
                    {/* Risk Profile */}
                    <div className="risk-profile">
                        <h2 className="results-section-title">Your Risk Profile</h2>
                        <div className="risk-badge" style={{ backgroundColor: getRiskLabel().color }}>
                            <span className="risk-emoji">{getRiskLabel().emoji}</span>
                            <span className="risk-text">{getRiskLabel().text} Investor</span>
                        </div>
                        <p className="risk-description">
                            Based on your equity allocation of {userAllocations.equity.toFixed(1)}%,
                            you are classified as a {getRiskLabel().text.toLowerCase()} investor.
                        </p>
                        <button className="btn-download" onClick={downloadReport}>
                            <Download size={20} />
                            Download Report (PDF)
                        </button>
                    </div>

                    {/* Charts Section */}
                    <div className="charts-container">
                        <div className="chart-wrapper">
                            <h3 className="chart-title">Your Current Portfolio</h3>
                            <div className="chart-box">
                                <Pie data={userChartData} options={chartOptions} />
                            </div>
                        </div>
                        <div className="chart-wrapper">
                            <h3 className="chart-title">Ideal Portfolio</h3>
                            <div className="chart-box">
                                <Pie data={idealChartData} options={idealChartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Surplus/Deficit Analysis */}
                    <div className="analysis-section">
                        <h2 className="results-section-title">Portfolio Analysis & Recommendations</h2>
                        <div className="analysis-grid">
                            {Object.entries(getSurplusDeficit).map(([key, data]) => {
                                const info = ASSET_INFO[key];
                                const Icon = info.icon;
                                return (
                                    <div className={`analysis-card ${data.status}`} key={key}>
                                        <div className="analysis-header">
                                            <Icon className="analysis-icon" style={{ color: info.color }} />
                                            <h4 className="analysis-asset">{info.label.split('(')[0].trim()}</h4>
                                        </div>
                                        <div className="analysis-body">
                                            <div className="analysis-row">
                                                <span>Your Allocation:</span>
                                                <span className="value">{data.actual.toFixed(1)}%</span>
                                            </div>
                                            <div className="analysis-row">
                                                <span>Ideal Allocation:</span>
                                                <span className="value">{data.ideal}%</span>
                                            </div>
                                            <div className="analysis-row diff">
                                                <span>Difference:</span>
                                                <span className={`value ${data.status}`}>
                                                    {data.difference > 0 ? '+' : ''}{data.difference.toFixed(1)}%
                                                    {data.status === 'surplus' && <ArrowUp size={16} />}
                                                    {data.status === 'deficit' && <ArrowDown size={16} />}
                                                    {data.status === 'balanced' && <CheckCircle size={16} />}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`analysis-status ${data.status}`}>
                                            {data.status === 'surplus' && (
                                                <>
                                                    <AlertCircle size={18} />
                                                    <span>Over-invested by ₹{Math.abs(data.amount).toLocaleString()}</span>
                                                </>
                                            )}
                                            {data.status === 'deficit' && (
                                                <>
                                                    <AlertCircle size={18} />
                                                    <span>Under-invested by ₹{Math.abs(data.amount).toLocaleString()}</span>
                                                </>
                                            )}
                                            {data.status === 'balanced' && (
                                                <>
                                                    <CheckCircle size={18} />
                                                    <span>Well balanced allocation</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="recommendations">
                        <h3 className="recommendations-title">📌 Key Recommendations</h3>
                        <ul className="recommendations-list">
                            {Object.entries(getSurplusDeficit).map(([key, data]) => {
                                if (data.status === 'balanced') return null;
                                const info = ASSET_INFO[key];
                                return (
                                    <li key={key} className={data.status}>
                                        {data.status === 'surplus' ? (
                                            <>Consider reducing <strong>{info.label.split('(')[0].trim()}</strong> by ₹{Math.abs(data.amount).toLocaleString()} ({Math.abs(data.difference).toFixed(1)}%)</>
                                        ) : (
                                            <>Consider increasing <strong>{info.label.split('(')[0].trim()}</strong> by ₹{Math.abs(data.amount).toLocaleString()} ({Math.abs(data.difference).toFixed(1)}%)</>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Disclaimer */}
                    <div className="advisory">
                        <h4 className="advisory-title">📌 Important Disclaimer</h4>
                        <p className="advisory-text">
                            This analysis is based on general investment principles and your stated portfolio.
                            Actual investment decisions should consider your age, financial goals, risk tolerance,
                            tax situation, and other personal factors. Please consult a certified financial advisor
                            before making any investment decisions.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InvestmentCalculator;
