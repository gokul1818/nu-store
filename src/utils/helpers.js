export const formatCurrency = (n) => {
  if (n == null) return "₹0";
  return `₹${Number(n).toFixed(2)}`;
};
