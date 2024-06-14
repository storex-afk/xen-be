function calculateProfitOrLoss(deals) {
  return deals.map(deal => {
    const { openPrice, closePrice, side, volume } = deal;
    let profitOrLoss = 0;

    if (side === 'Buy') {
      profitOrLoss = (closePrice - openPrice) * volume;
    } else if (side === 'Sell') {
      profitOrLoss = (openPrice - closePrice) * volume;
    }

    return {
      ...deal,
      profitOrLoss
    };
  });
}

// Example usage
const deals = [
  { deal: 1, openTime: '2023-06-10 09:00:00', openPrice: 1.2000, closeTime: '2023-06-10 15:00:00', closePrice: 1.2100, side: 'Buy', symbol: 'EUR/USD', volume: 100000 },
  { deal: 2, openTime: '2023-06-11 09:00:00', openPrice: 1.2000, closeTime: '2023-06-11 15:00:00', closePrice: 1.1900, side: 'Sell', symbol: 'EUR/USD', volume: 100000 },
  { deal: 3, openTime: '2023-06-12 09:00:00', openPrice: 1.2000, closeTime: '2023-06-12 15:00:00', closePrice: 1.1900, side: 'Buy', symbol: 'EUR/USD', volume: 100000 },
  { deal: 4, openTime: '2023-06-13 09:00:00', openPrice: 1.2000, closeTime: '2023-06-13 15:00:00', closePrice: 1.2100, side: 'Sell', symbol: 'EUR/USD', volume: 100000 }
];

const results = calculateProfitOrLoss(deals);
console.log(results);
