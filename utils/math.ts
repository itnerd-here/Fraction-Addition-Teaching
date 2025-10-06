
// Greatest Common Divisor
const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
};

// Least Common Multiple
export const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
};
