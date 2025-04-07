type CurrencyCode = 'USD' | 'NGN' | 'EUR' | string;

const currencyRates: Record<string, number> = {
  USD: 1,
  NGN: 1510, // Example rate
  EUR: 0.85,
  // Add more as needed
};

const currencySymbols: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  // Add more symbols if needed
};

function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (isNaN(amount) || amount <= 0) return 0;

  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) return amount;

  const fromRate = currencyRates[from];
  const toRate = currencyRates[to];

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency: ${from} or ${to}`);
  }

  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

function formatPrice(amount: number, currency: CurrencyCode = 'USD'): string {
    const normalized = currency.toUpperCase();
    const symbol = currencySymbols[normalized] || '';
  
    try {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: normalized,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      const formattedAmount = formatNumberWithCommas(Number(amount.toFixed(2)));
      return `${symbol}${formattedAmount}`;
    }
  }
  

export {
  formatNumberWithCommas,
  convertCurrency,
  formatPrice,
  currencyRates,
  currencySymbols,
};
