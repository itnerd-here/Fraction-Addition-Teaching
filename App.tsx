

import React, { useState, useCallback } from 'react';
import { lcm } from './utils/math';
import FractionInput from './components/FractionInput';
import PieChart from './components/PieChart';
import { PlusIcon, EqualsIcon, MinusIcon } from './components/IconComponents';

type FractionObject = {
    whole?: number;
    num: number;
    den: number;
};

// Fix: Moved helper components before the App component to ensure they are defined before use.
const MultiPieDisplay = ({ fraction, showLabels = false }: { fraction: { num: number, den: number }, showLabels?: boolean }) => {
    const { num, den } = fraction;

    if (den <= 0) {
        return <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 p-4 text-center">Invalid denominator</div>;
    }

    const absNum = Math.abs(num);
    const fullPies = Math.floor(absNum / den);
    const remainderNum = absNum % den;

    const pies = [];
    for (let i = 0; i < fullPies; i++) {
        pies.push(
            <div key={`full-${i}`} className="flex flex-col items-center">
                <PieChart numerator={den} denominator={den} />
                {showLabels && <span className="font-bold text-2xl text-gray-700 mt-2">1</span>}
            </div>
        );
    }

    if (remainderNum > 0) {
        pies.push(
            <div key={`remainder`} className="flex flex-col items-center">
                <PieChart numerator={remainderNum} denominator={den} />
                {showLabels && <span className="font-bold text-2xl text-gray-700 mt-2">{remainderNum}/{den}</span>}
            </div>
        );
    }
    
    if (pies.length === 0 && absNum === 0) {
         pies.push(
            <div key="zero" className="flex flex-col items-center">
                <PieChart numerator={0} denominator={den} />
                {showLabels && <span className="font-bold text-2xl text-gray-700 mt-2">0</span>}
            </div>
        );
    }
    
    return (
        <div className="flex flex-wrap gap-4 justify-center items-center">
            {num < 0 && <span className="font-extrabold text-7xl text-red-500">-</span>}
            {pies}
        </div>
    );
};

const ResultDisplay = ({ fraction }: { fraction: { num: number, den: number } }) => {
    const { num, den } = fraction;
    const isNegative = num < 0;
    const absNum = Math.abs(num);

    const whole = Math.floor(absNum / den);
    const remainderNum = absNum % den;

    return (
        <div className="flex flex-col items-center gap-4 text-center relative">
             <MultiPieDisplay fraction={{num: absNum, den}} showLabels={true} />
             <div className="flex items-end gap-3 justify-center mt-2">
                {isNegative && <span className="font-extrabold text-7xl text-red-500">-</span>}
                {whole > 0 && (
                     <span className="font-bold text-6xl text-teal-600">{whole}</span>
                )}
                {remainderNum > 0 && (
                     <div className="text-center leading-none mb-1">
                         <span className="font-bold text-4xl text-teal-600">{remainderNum}</span>
                         <div className="border-t-4 border-teal-600 w-12 mx-auto"></div>
                         <span className="font-bold text-4xl text-teal-600">{den}</span>
                     </div>
                )}
                {whole === 0 && remainderNum === 0 && (
                   <span className="font-bold text-6xl text-teal-600">0</span>
                )}
             </div>
             {whole > 0 && (
                <div className="text-center mt-2 text-gray-500">
                    <p>(or <span className="font-bold">{isNegative ? '-' : ''}{absNum}/{den}</span> as an improper fraction)</p>
                </div>
             )}
        </div>
    );
};


type ResultStepProps = {
    title: string;
    children: React.ReactNode;
};

const ResultStep = ({ title, children }: ResultStepProps) => (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 text-center mb-4">{title}</h2>
        {children}
    </div>
);

type FractionDisplayProps = {
    fraction: FractionObject;
    original?: { num: number; den: number; };
};

const FractionDisplay = ({ fraction, original }: FractionDisplayProps) => {
    const improperForPies = {
        num: (fraction.whole || 0) * fraction.den + fraction.num,
        den: fraction.den,
    };
    
    const displayNum = fraction.whole ? fraction.num : improperForPies.num;
    const displayDen = fraction.den;

    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <MultiPieDisplay fraction={improperForPies} />
            <div className="flex items-center gap-4 justify-center mt-2">
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
                <div className="flex items-end gap-3">
                    {fraction.whole > 0 && (
                        <span className="font-bold text-5xl text-teal-600">{fraction.whole}</span>
                    )}
                    <div className="text-center leading-none mb-1">
                        <span className="font-bold text-4xl text-teal-600">{displayNum}</span>
                        <div className="border-t-4 border-teal-600 w-12 mx-auto"></div>
                        <span className="font-bold text-4xl text-teal-600">{displayDen}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [operation, setOperation] = useState('addition'); // 'addition' or 'subtraction'
    const [fraction1, setFraction1] = useState<FractionObject>({ whole: 0, num: 1, den: 2 });
    const [fraction2, setFraction2] = useState<FractionObject>({ whole: 0, num: 1, den: 3 });
    const [calculation, setCalculation] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = useCallback(() => {
        setError('');
        setCalculation(null);

        if (fraction1.den === 0 || fraction2.den === 0) {
            setError('The bottom number (denominator) cannot be zero!');
            return;
        }
        if (fraction1.num < 0 || fraction1.den < 1 || fraction2.num < 0 || fraction2.den < 1 || (fraction1.whole || 0) < 0 || (fraction2.whole || 0) < 0) {
            setError('Please use positive numbers for fractions.');
            return;
        }

        // Convert mixed fractions to improper fractions
        const improper1 = {
            num: (fraction1.whole || 0) * fraction1.den + fraction1.num,
            den: fraction1.den
        };
        const improper2 = {
            num: (fraction2.whole || 0) * fraction2.den + fraction2.num,
            den: fraction2.den
        };

        const commonDenominator = lcm(improper1.den, improper2.den);
        const converted1 = {
            num: improper1.num * (commonDenominator / improper1.den),
            den: commonDenominator
        };
        const converted2 = {
            num: improper2.num * (commonDenominator / improper2.den),
            den: commonDenominator
        };
        
        const resultNum = operation === 'addition'
            ? converted1.num + converted2.num
            : converted1.num - converted2.num;

        const sum = {
            num: resultNum,
            den: commonDenominator
        };

        setCalculation({
            original1: fraction1,
            original2: fraction2,
            improper1,
            improper2,
            commonDenominator,
            converted1,
            converted2,
            sum,
            operation
        });
    }, [fraction1, fraction2, operation]);
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-teal-100 font-sans text-gray-800 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-600">Fraction Fun! 🥧</h1>
                    <p className="text-lg text-gray-600 mt-2">See how adding and subtracting fractions works with colorful pies.</p>
                </header>

                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <button
                            onClick={() => setOperation('addition')}
                            className={`px-6 py-2 font-bold rounded-full text-lg transition-all duration-300 ${operation === 'addition' ? 'bg-teal-500 text-white shadow-md' : 'bg-white/60 text-teal-600 hover:bg-white'}`}
                            aria-pressed={operation === 'addition'}
                        >
                            Addition
                        </button>
                        <button
                            onClick={() => setOperation('subtraction')}
                            className={`px-6 py-2 font-bold rounded-full text-lg transition-all duration-300 ${operation === 'subtraction' ? 'bg-teal-500 text-white shadow-md' : 'bg-white/60 text-teal-600 hover:bg-white'}`}
                            aria-pressed={operation === 'subtraction'}
                        >
                            Subtraction
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <FractionInput fraction={fraction1} setFraction={setFraction1} />
                        <div className="text-teal-500">
                           {operation === 'addition' ? <PlusIcon /> : <MinusIcon />}
                        </div>
                        <FractionInput fraction={fraction2} setFraction={setFraction2} />
                    </div>
                    <div className="text-center mt-6">
                        <button onClick={handleCalculate} className="bg-teal-500 text-white font-bold text-xl px-10 py-3 rounded-full shadow-md hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300">
                           {operation === 'addition' ? 'Add them up!' : 'Subtract them!'}
                        </button>
                    </div>
                    {error && <p className="text-center text-red-500 font-bold mt-4">{error}</p>}
                </div>

                {calculation && (
                    <div className="space-y-8 animate-fade-in">
                        <ResultStep title="Step 1: Your Original Fractions">
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay fraction={calculation.original1} />
                                {calculation.operation === 'addition' ? <PlusIcon /> : <MinusIcon />}
                                <FractionDisplay fraction={calculation.original2} />
                            </div>
                        </ResultStep>

                         <ResultStep title="Step 2: Convert to Improper Fractions">
                             <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">First, we turn any mixed numbers into fractions so they're easier to work with.</p>
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay fraction={calculation.improper1} />
                                {calculation.operation === 'addition' ? <PlusIcon /> : <MinusIcon />}
                                <FractionDisplay fraction={calculation.improper2} />
                            </div>
                        </ResultStep>

                        <ResultStep title={`Step 3: Find a Common Denominator (${calculation.commonDenominator})`}>
                            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">To add or subtract, the pies need the same number of total slices. We turn both into {calculation.commonDenominator}-slice pies!</p>
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay original={calculation.improper1} fraction={calculation.converted1} />
                                {calculation.operation === 'addition' ? <PlusIcon /> : <MinusIcon />}
                                <FractionDisplay original={calculation.improper2} fraction={calculation.converted2} />
                            </div>
                        </ResultStep>

                        <ResultStep title={`Step 4: ${calculation.operation === 'addition' ? 'Add' : 'Subtract'} Them Together!`}>
                            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                                <FractionDisplay fraction={calculation.converted1} />
                                {calculation.operation === 'addition' ? <PlusIcon /> : <MinusIcon />}
                                <FractionDisplay fraction={calculation.converted2} />
                                <EqualsIcon />
                                <ResultDisplay fraction={calculation.sum} />
                            </div>
                        </ResultStep>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;