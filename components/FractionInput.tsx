
import React from 'react';

const FractionInput = ({ fraction, setFraction }) => {
    const handleWholeChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setFraction(f => ({ ...f, whole: isNaN(value) ? 0 : value }));
    };

    const handleNumChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setFraction(f => ({ ...f, num: isNaN(value) ? 0 : value }));
    };

    const handleDenChange = (e) => {
        const value = parseInt(e.target.value, 10);
        // Denominator cannot be 0, default to 1 if invalid input
        setFraction(f => ({ ...f, den: isNaN(value) || value === 0 ? 1 : value }));
    };

    return (
        <div className="flex items-center justify-center gap-3">
            <input
                type="number"
                value={fraction.whole}
                onChange={handleWholeChange}
                className="w-20 h-24 text-5xl font-bold text-center bg-white border-2 border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                aria-label="Whole number"
                min="0"
            />
            <div className="flex flex-col items-center gap-1">
                <input
                    type="number"
                    value={fraction.num}
                    onChange={handleNumChange}
                    className="w-20 h-12 text-3xl font-bold text-center bg-white border-2 border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                    aria-label="Numerator"
                    min="0"
                />
                <div className="w-24 h-1 bg-teal-400 rounded-full"></div>
                <input
                    type="number"
                    value={fraction.den}
                    onChange={handleDenChange}
                    className="w-20 h-12 text-3xl font-bold text-center bg-white border-2 border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                    aria-label="Denominator"
                    min="1"
                />
            </div>
        </div>
    );
};

export default FractionInput;
