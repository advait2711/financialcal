import React, { useState } from 'react';
import { TrendingUp, Wallet, Shield, PiggyBank, CreditCard, LineChart, Calculator } from 'lucide-react';
import './FinancialHealthCalculator.css';

function FinancialHealthCalculator({ onBack }) {
    const [formData, setFormData] = useState({
        monthlyIncome: '',
        incomeSource: 'Salaried',
        incomeStability: 5,
        monthlyExpenses: '',
        emergencyFund: '',
        monthlyEMIs: '',
        investments: {
            fd: false,
            mf: false,
            shares: false,
            pf: false,
            ppf: false,
            others: false,
        },
        regularInvestments: 'No',
        healthInsurance: 'No',
        lifeInsurance: 'No',
    });

    const [scores, setScores] = useState({
        incomeStability: 0,
        expenseManagement: 0,
        emergencyFund: 0,
        debtManagement: 0,
        investments: 0,
        insurance: 0,
    });

    const [showResults, setShowResults] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('investment-')) {
            const investmentKey = name.replace('investment-', '');
            setFormData({
                ...formData,
                investments: {
                    ...formData.investments,
                    [investmentKey]: checked,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const calculateScores = () => {
        const income = parseFloat(formData.monthlyIncome) || 0;
        const expenses = parseFloat(formData.monthlyExpenses) || 0;
        const emergencyFund = parseFloat(formData.emergencyFund) || 0;
        const emis = parseFloat(formData.monthlyEMIs) || 0;

        const newScores = { ...scores };

        // 1. Income Stability Score (user input)
        newScores.incomeStability = parseInt(formData.incomeStability);

        // 2. Expense Management Score
        const savings = income - expenses;
        const savingsRatio = income > 0 ? (savings / income) * 100 : 0;

        if (savingsRatio >= 30) newScores.expenseManagement = 5;
        else if (savingsRatio >= 20) newScores.expenseManagement = 4;
        else if (savingsRatio >= 10) newScores.expenseManagement = 3;
        else if (savingsRatio >= 1) newScores.expenseManagement = 2;
        else newScores.expenseManagement = 1;

        // 3. Emergency Fund Score
        const emergencyCover = expenses > 0 ? emergencyFund / expenses : 0;

        if (emergencyCover >= 6) newScores.emergencyFund = 5;
        else if (emergencyCover >= 4) newScores.emergencyFund = 4;
        else if (emergencyCover >= 3) newScores.emergencyFund = 3;
        else if (emergencyCover >= 1) newScores.emergencyFund = 2;
        else newScores.emergencyFund = 1;

        // 4. Debt Management Score
        const debtRatio = income > 0 ? (emis / income) * 100 : 0;

        if (debtRatio <= 20) newScores.debtManagement = 5;
        else if (debtRatio <= 30) newScores.debtManagement = 4;
        else if (debtRatio <= 40) newScores.debtManagement = 3;
        else if (debtRatio <= 50) newScores.debtManagement = 2;
        else newScores.debtManagement = 1;

        // 5. Investment Score
        const activeInvestments = Object.values(formData.investments).filter(Boolean).length;
        const isRegular = formData.regularInvestments === 'Yes';

        if (activeInvestments >= 3 && isRegular) newScores.investments = 5;
        else if (activeInvestments >= 2 && isRegular) newScores.investments = 4;
        else if (activeInvestments >= 1) newScores.investments = 3;
        else if (formData.investments.fd) newScores.investments = 2;
        else newScores.investments = 1;

        // 6. Insurance Score
        const hasHealth = formData.healthInsurance === 'Yes';
        const hasLife = formData.lifeInsurance === 'Yes';

        if (hasHealth && hasLife) newScores.insurance = 5;
        else if (hasHealth || hasLife) newScores.insurance = 3;
        else newScores.insurance = 1;

        setScores(newScores);
        setShowResults(true);
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const getHealthStatus = () => {
        if (totalScore >= 26) return { label: 'Excellent', color: 'excellent', emoji: '🟢' };
        if (totalScore >= 21) return { label: 'Good', color: 'good', emoji: '🟡' };
        if (totalScore >= 15) return { label: 'Average', color: 'average', emoji: '🟠' };
        return { label: 'Needs Attention', color: 'poor', emoji: '🔴' };
    };

    const getInterpretation = () => {
        if (totalScore >= 26) return 'Excellent Financial Health';
        if (totalScore >= 21) return 'Good, scope for optimization';
        if (totalScore >= 15) return 'Average, needs improvement';
        return 'Financial stress zone';
    };

    const resetCalculator = () => {
        setFormData({
            monthlyIncome: '',
            incomeSource: 'Salaried',
            incomeStability: 5,
            monthlyExpenses: '',
            emergencyFund: '',
            monthlyEMIs: '',
            investments: {
                fd: false,
                mf: false,
                shares: false,
                pf: false,
                ppf: false,
                others: false,
            },
            regularInvestments: 'No',
            healthInsurance: 'No',
            lifeInsurance: 'No',
        });
        setScores({
            incomeStability: 0,
            expenseManagement: 0,
            emergencyFund: 0,
            debtManagement: 0,
            investments: 0,
            insurance: 0,
        });
        setShowResults(false);
    };

    return (
        <div className="financial-calculator">
            {/* Header */}
            <header className="header">
                <button className="back-btn" onClick={onBack}>
                    ← Back to Home
                </button>
                <div className="header-content">
                    <div className="header-icon">
                        <Calculator className="icon" />
                    </div>
                    <h1 className="title">Financial Health Calculator</h1>
                    <p className="subtitle">Assess your overall financial wellness with our comprehensive 6-point evaluation</p>
                </div>
            </header>

            {/* Form Sections */}
            <div className="sections">
                {/* Section 1: Income Stability */}
                <section className="section">
                    <div className="section-header">
                        <TrendingUp className="section-icon" />
                        <h2 className="section-title">Income Stability</h2>
                    </div>
                    <div className="form-group">
                        <label className="label">Monthly Net Income (₹)</label>
                        <input
                            type="number"
                            name="monthlyIncome"
                            value={formData.monthlyIncome}
                            onChange={handleChange}
                            placeholder="Enter your monthly income"
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Income Source</label>
                        <select name="incomeSource" value={formData.incomeSource} onChange={handleChange} className="select">
                            <option value="Salaried">Salaried</option>
                            <option value="Business">Business</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">Income Stability (1-5)</label>
                        <div className="stability-buttons">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    className={`stability-btn ${formData.incomeStability === rating ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, incomeStability: rating })}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                        <p className="hint">5 = Very stable (fixed salary) | 3 = Variable but consistent | 1 = Highly irregular</p>
                    </div>
                </section>

                {/* Section 2: Expense Management */}
                <section className="section">
                    <div className="section-header">
                        <Wallet className="section-icon" />
                        <h2 className="section-title">Expense Management (Excluding EMIs)</h2>
                    </div>
                    <div className="form-group">
                        <label className="label">Monthly Expenses (₹)</label>
                        <input
                            type="number"
                            name="monthlyExpenses"
                            value={formData.monthlyExpenses}
                            onChange={handleChange}
                            placeholder="Enter your monthly expenses"
                            className="input"
                        />
                    </div>
                    {formData.monthlyIncome && formData.monthlyExpenses && (
                        <div className="calculated-info">
                            <div className="info-item">
                                <span className="info-label">Monthly Savings:</span>
                                <span className="info-value">₹{(parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyExpenses)).toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Savings Ratio:</span>
                                <span className="info-value">{(((parseFloat(formData.monthlyIncome) - parseFloat(formData.monthlyExpenses)) / parseFloat(formData.monthlyIncome)) * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Section 3: Emergency Fund */}
                <section className="section">
                    <div className="section-header">
                        <Shield className="section-icon" />
                        <h2 className="section-title">Emergency Fund</h2>
                    </div>
                    <div className="form-group">
                        <label className="label">Emergency Fund Available (₹)</label>
                        <input
                            type="number"
                            name="emergencyFund"
                            value={formData.emergencyFund}
                            onChange={handleChange}
                            placeholder="Enter your emergency fund amount"
                            className="input"
                        />
                    </div>
                    {formData.emergencyFund && formData.monthlyExpenses && (
                        <div className="calculated-info">
                            <div className="info-item">
                                <span className="info-label">Emergency Cover:</span>
                                <span className="info-value">{(parseFloat(formData.emergencyFund) / parseFloat(formData.monthlyExpenses)).toFixed(1)} months</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Section 4: Debt Management */}
                <section className="section">
                    <div className="section-header">
                        <CreditCard className="section-icon" />
                        <h2 className="section-title">Debt Management</h2>
                    </div>
                    <div className="form-group">
                        <label className="label">Total Monthly EMIs (₹)</label>
                        <input
                            type="number"
                            name="monthlyEMIs"
                            value={formData.monthlyEMIs}
                            onChange={handleChange}
                            placeholder="Enter total monthly EMI payments"
                            className="input"
                        />
                    </div>
                    {formData.monthlyEMIs && formData.monthlyIncome && (
                        <div className="calculated-info">
                            <div className="info-item">
                                <span className="info-label">Debt-to-Income Ratio:</span>
                                <span className="info-value">{((parseFloat(formData.monthlyEMIs) / parseFloat(formData.monthlyIncome)) * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Section 5: Investments */}
                <section className="section">
                    <div className="section-header">
                        <LineChart className="section-icon" />
                        <h2 className="section-title">Investment & Wealth Building</h2>
                    </div>
                    <div className="form-group">
                        <label className="label">Active Investments</label>
                        <div className="checkbox-grid">
                            <label className="checkbox-label">
                                <input type="checkbox" name="investment-fd" checked={formData.investments.fd} onChange={handleChange} />
                                <span>Fixed Deposit</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="investment-mf" checked={formData.investments.mf} onChange={handleChange} />
                                <span>Mutual Funds</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="investment-shares" checked={formData.investments.shares} onChange={handleChange} />
                                <span>Shares/Stocks</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="investment-pf" checked={formData.investments.pf} onChange={handleChange} />
                                <span>PF/EPF</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="investment-ppf" checked={formData.investments.ppf} onChange={handleChange} />
                                <span>PPF</span>
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="investment-others" checked={formData.investments.others} onChange={handleChange} />
                                <span>Others</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">Regular Monthly Investments?</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="regularInvestments"
                                    value="Yes"
                                    checked={formData.regularInvestments === 'Yes'}
                                    onChange={handleChange}
                                />
                                <span>Yes</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="regularInvestments"
                                    value="No"
                                    checked={formData.regularInvestments === 'No'}
                                    onChange={handleChange}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section 6: Insurance */}
                <section className="section">
                    <div className="section-header">
                        <PiggyBank className="section-icon" />
                        <h2 className="section-title">Insurance Protection</h2>
                    </div>
                    <div className="form-group">
                        <label className="label">Health Insurance</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="healthInsurance"
                                    value="Yes"
                                    checked={formData.healthInsurance === 'Yes'}
                                    onChange={handleChange}
                                />
                                <span>Yes</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="healthInsurance"
                                    value="No"
                                    checked={formData.healthInsurance === 'No'}
                                    onChange={handleChange}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label">Life Insurance</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="lifeInsurance"
                                    value="Yes"
                                    checked={formData.lifeInsurance === 'Yes'}
                                    onChange={handleChange}
                                />
                                <span>Yes</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="lifeInsurance"
                                    value="No"
                                    checked={formData.lifeInsurance === 'No'}
                                    onChange={handleChange}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                </section>
            </div>

            {/* Calculate Button */}
            <div className="actions">
                <button className="btn-calculate" onClick={calculateScores}>
                    Calculate Financial Health
                </button>
                {showResults && (
                    <button className="btn-reset" onClick={resetCalculator}>
                        Reset Calculator
                    </button>
                )}
            </div>

            {/* Results */}
            {showResults && (
                <div className="results">
                    <div className="results-header">
                        <h2 className="results-title">Your Financial Health Score</h2>
                        <div className={`score-badge ${getHealthStatus().color}`}>
                            <span className="score-emoji">{getHealthStatus().emoji}</span>
                            <span className="score-total">{totalScore}</span>
                            <span className="score-max">/30</span>
                        </div>
                    </div>

                    <div className="score-breakdown">
                        <div className="score-item">
                            <div className="score-label">
                                <TrendingUp size={18} />
                                <span>Income Stability</span>
                            </div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: `${(scores.incomeStability / 5) * 100}%` }}></div>
                            </div>
                            <span className="score-number">{scores.incomeStability}/5</span>
                        </div>

                        <div className="score-item">
                            <div className="score-label">
                                <Wallet size={18} />
                                <span>Expense Management(Excluding EMI)</span>
                            </div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: `${(scores.expenseManagement / 5) * 100}%` }}></div>
                            </div>
                            <span className="score-number">{scores.expenseManagement}/5</span>
                        </div>

                        <div className="score-item">
                            <div className="score-label">
                                <Shield size={18} />
                                <span>Emergency Fund</span>
                            </div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: `${(scores.emergencyFund / 5) * 100}%` }}></div>
                            </div>
                            <span className="score-number">{scores.emergencyFund}/5</span>
                        </div>

                        <div className="score-item">
                            <div className="score-label">
                                <CreditCard size={18} />
                                <span>Debt Management</span>
                            </div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: `${(scores.debtManagement / 5) * 100}%` }}></div>
                            </div>
                            <span className="score-number">{scores.debtManagement}/5</span>
                        </div>

                        <div className="score-item">
                            <div className="score-label">
                                <LineChart size={18} />
                                <span>Investments</span>
                            </div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: `${(scores.investments / 5) * 100}%` }}></div>
                            </div>
                            <span className="score-number">{scores.investments}/5</span>
                        </div>

                        <div className="score-item">
                            <div className="score-label">
                                <PiggyBank size={18} />
                                <span>Insurance Protection</span>
                            </div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: `${(scores.insurance / 5) * 100}%` }}></div>
                            </div>
                            <span className="score-number">{scores.insurance}/5</span>
                        </div>
                    </div>

                    <div className={`interpretation ${getHealthStatus().color}`}>
                        <h3 className="interpretation-title">{getHealthStatus().label}</h3>
                        <p className="interpretation-text">{getInterpretation()}</p>
                    </div>

                    <div className="advisory">
                        <h4 className="advisory-title">📌 Advisory Note</h4>
                        <p className="advisory-text">
                            This calculator provides an indicative overview of your financial health.
                            Detailed financial planning should consider tax efficiency, risk profile, age,
                            life goals, and other personal circumstances. Consult a certified financial
                            advisor for personalized recommendations.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FinancialHealthCalculator;
