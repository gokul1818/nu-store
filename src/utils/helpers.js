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
export const buildProductQuery = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      searchParams.append(key, val);
    }
  });

  return searchParams.toString();
};
