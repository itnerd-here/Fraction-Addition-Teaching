
import React from 'react';

const FractionInput = ({ fraction, setFraction }) => {
    const handleNumChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setFraction(f => ({ ...f, num: isNaN(value) ? 0 : value }));
    };

    const handleDenChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setFraction(f => ({ ...f, den: isNaN(value) ? 1 : value }));
    };

    return (
        <div className="flex flex-col items-center gap-1 p-4 bg-teal-50 rounded-lg shadow-inner">
            <input
                type="number"
                value={fraction.num}
                onChange={handleNumChange}
                className="w-24 h-16 text-4xl font-bold text-center bg-white border-2 border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                aria-label="Numerator"
                min="0"
            />
            <div className="w-28 h-1 bg-teal-400 rounded-full"></div>
            <input
                type="number"
                value={fraction.den}
                onChange={handleDenChange}
                className="w-24 h-16 text-4xl font-bold text-center bg-white border-2 border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                aria-label="Denominator"
                min="1"
            />
        </div>
    );
};

export default FractionInput;
