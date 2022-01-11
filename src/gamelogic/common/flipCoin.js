const isEven = (num) => (num < 0.5 ? 'heads' : 'tails');

const flipCoin = () => isEven(Math.random());

module.exports = { flipCoin };
