

import React, { useState, useCallback } from 'react';
import { lcm } from './utils/math';
import FractionInput from './components/FractionInput';
import PieChart from './components/PieChart';
import { PlusIcon, EqualsIcon } from './components/IconComponents';

const App = () => {
    const [fraction1, setFraction1] = useState({ num: 1, den: 2 });
    const [fraction2, setFraction2] = useState({ num: 1, den: 3 });
    const [calculation, setCalculation] = useState(null);
    const [error, setError] = useState('');

    const handleAdd = useCallback(() => {
        setError('');
        setCalculation(null);

        if (fraction1.den === 0 || fraction2.den === 0) {
            setError('The bottom number (denominator) cannot be zero!');
            return;
        }
        if (fraction1.num < 0 || fraction1.den < 1 || fraction2.num < 0 || fraction2.den < 1) {
            setError('Please use positive numbers for fractions.');
            return;
        }
        if (fraction1.num > fraction1.den || fraction2.num > fraction2.den) {
            setError('Please use fractions where the top number is not bigger than the bottom one.');
            return;
        }

        const commonDenominator = lcm(fraction1.den, fraction2.den);
        const converted1 = {
            num: fraction1.num * (commonDenominator / fraction1.den),
            den: commonDenominator
        };
        const converted2 = {
            num: fraction2.num * (commonDenominator / fraction2.den),
            den: commonDenominator
        };
        const sum = {
            num: converted1.num + converted2.num,
            den: commonDenominator
        };

        setCalculation({
            original1: fraction1,
            original2: fraction2,
            commonDenominator,
            converted1,
            converted2,
            sum
        });
    }, [fraction1, fraction2]);
    
    const renderResultPies = (fraction) => {
        const fullPies = Math.floor(fraction.num / fraction.den);
        const remainderNum = fraction.num % fraction.den;

        const pies = [];
        for (let i = 0; i < fullPies; i++) {
            pies.push(
                <div key={`full-${i}`} className="flex flex-col items-center">
                    <PieChart numerator={fraction.den} denominator={fraction.den} />
                    <span className="font-bold text-2xl text-gray-700 mt-2">1</span>
                </div>
            );
        }

        if (remainderNum > 0) {
            pies.push(
                <div key="remainder" className="flex flex-col items-center">
                    <PieChart numerator={remainderNum} denominator={fraction.den} />
                    <span className="font-bold text-2xl text-gray-700 mt-2">{remainderNum}/{fraction.den}</span>
                </div>
            );
        }
        
        if (pies.length === 0) {
             pies.push(
                <div key="zero" className="flex flex-col items-center">
                    <PieChart numerator={0} denominator={fraction.den > 0 ? fraction.den : 1} />
                    <span className="font-bold text-2xl text-gray-700 mt-2">0</span>
                </div>
            );
        }

        return pies;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-teal-100 font-sans text-gray-800 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-600">Fraction Addition Fun! 🥧</h1>
                    <p className="text-lg text-gray-600 mt-2">See how adding fractions works with colorful pies.</p>
                </header>

                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <FractionInput fraction={fraction1} setFraction={setFraction1} />
                        <div className="text-teal-500">
                           <PlusIcon />
                        </div>
                        <FractionInput fraction={fraction2} setFraction={setFraction2} />
                    </div>
                    <div className="text-center mt-6">
                        <button onClick={handleAdd} className="bg-teal-500 text-white font-bold text-xl px-10 py-3 rounded-full shadow-md hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300">
                            Add them up!
                        </button>
                    </div>
                    {error && <p className="text-center text-red-500 font-bold mt-4">{error}</p>}
                </div>

                {calculation && (
                    <div className="space-y-8 animate-fade-in">
                        <ResultStep title="Step 1: Your Original Fractions">
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay fraction={calculation.original1} />
                                <PlusIcon />
                                <FractionDisplay fraction={calculation.original2} />
                            </div>
                        </ResultStep>

                        <ResultStep title={`Step 2: Find a Common Denominator (${calculation.commonDenominator})`}>
                            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">To add fractions, they need to have the same number of slices. We turn both pies into {calculation.commonDenominator} slices!</p>
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay original={calculation.original1} fraction={calculation.converted1} />
                                <PlusIcon />
                                <FractionDisplay original={calculation.original2} fraction={calculation.converted2} />
                            </div>
                        </ResultStep>

                        <ResultStep title="Step 3: Add Them Together!">
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay fraction={calculation.converted1} />
                                <PlusIcon />
                                <FractionDisplay fraction={calculation.converted2} />
                                <EqualsIcon />
                                <div className="flex flex-col items-center gap-2">
                                     <div className="flex flex-wrap gap-4 justify-center">
                                       {renderResultPies(calculation.sum)}
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold text-5xl text-teal-600">{calculation.sum.num}</span>
                                        <div className="border-t-4 border-teal-600 w-16 mx-auto my-1"></div>
                                        <span className="font-bold text-5xl text-teal-600">{calculation.sum.den}</span>
                                    </div>
                                </div>
                            </div>
                        </ResultStep>
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultStep = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 text-center mb-4">{title}</h2>
        {children}
    </div>
);

// FIX: Add explicit prop types to make the `original` prop optional, resolving TypeScript errors.
const FractionDisplay = ({ fraction, original }: { fraction: { num: number; den: number; }; original?: { num: number; den: number; } }) => (
    <div className="flex flex-col items-center gap-2 text-center">
        <PieChart numerator={fraction.num} denominator={fraction.den} />
        <div className="flex items-center gap-4">
            {original && (
                <>
                <div className="text-center">
                    <span className="font-bold text-3xl text-gray-500">{original.num}</span>
                    <div className="border-t-2 border-gray-500 w-10 mx-auto"></div>
                    <span className="font-bold text-3xl text-gray-500">{original.den}</span>
                </div>
                <EqualsIcon size={32} />
                </>
            )}
            <div className="text-center">
                <span className="font-bold text-4xl text-teal-600">{fraction.num}</span>
                <div className="border-t-4 border-teal-600 w-12 mx-auto"></div>
                <span className="font-bold text-4xl text-teal-600">{fraction.den}</span>
            </div>
        </div>
    </div>
);

export default App;