type CurrencyCode = 'USD' | 'NGN' | 'EUR' | string;

const BASE_CURRENCY = 'NGN'; // All currencyRates are relative to this

const currencyRates: Record<string, number> = {
  NGN: 1,      // Base currency
  USD: 1510,   // 1 USD = 1510 NGN
  EUR: 1620,   // 1 EUR = 1620 NGN (example)
  // Add more
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

  // Convert from `fromCurrency` to NGN, then from NGN to `toCurrency`
  const amountInNGN = from === BASE_CURRENCY ? amount : amount * fromRate;
  return to === BASE_CURRENCY ? amountInNGN : amountInNGN / toRate;
}


function formatPrice(
  amount: number,
  currency: CurrencyCode = 'NGN',
  fromCurrency: CurrencyCode = BASE_CURRENCY
): string {
  const normalizedCurrency = currency.toUpperCase();
  const symbol = currencySymbols[normalizedCurrency] || '';

  try {
    const convertedAmount = convertCurrency(amount, fromCurrency, normalizedCurrency);

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  } catch {
    const fallbackAmount = convertCurrency(amount, fromCurrency, normalizedCurrency);
    const formattedAmount = formatNumberWithCommas(Number(fallbackAmount.toFixed(2)));
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
