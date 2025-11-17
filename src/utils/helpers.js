export const formatCurrency = (n) => {
  if (n == null) return "₹0";
  return `₹${Number(n).toFixed(2)}`;
};

export function formatCurrencyINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}