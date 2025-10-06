
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const FILLED_COLOR = '#2dd4bf'; // teal-400
const EMPTY_COLOR = '#f0f9ff'; // sky-50
const DASHED_BORDER_COLOR = '#a1a1aa'; // zinc-400, a neutral grey for contrast

const PieChartComponent = ({ numerator, denominator }) => {
    // Handle invalid denominator. A pie must have at least one slice.
    if (denominator <= 0) {
        return <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 p-4 text-center">Invalid denominator</div>;
    }

    // Create an array of data points, one for each slice of the pie.
    // Each slice has an equal value of 1, ensuring they are all the same size.
    const pieData = Array.from({ length: denominator }, (_, i) => ({
        name: `slice-${i}`,
        value: 1,
    }));

    return (
        <div className="w-40 h-40 sm:w-48 sm:h-48">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="0%"
                        outerRadius="80%"
                        dataKey="value"
                        stroke={DASHED_BORDER_COLOR}
                        strokeWidth={2}
                        strokeDasharray="5 5" // This creates the dashed line effect for slice borders
                        startAngle={90}
                        endAngle={-270}
                        isAnimationActive={false} // Disable animation for instant visual feedback
                    >
                        {pieData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                // Color the slice if its index is less than the numerator
                                fill={index < numerator ? FILLED_COLOR : EMPTY_COLOR} 
                            />
                        ))}
                    </Pie>
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
