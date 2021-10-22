const isEven = (num) => (num < 0.5 ? 'heads' : 'tails');

export const flipCoin = () => isEven(Math.random());
