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

export const generateTrackingSteps = (status, created_at) => {
  const steps = [
    { title: "Processing", date: created_at, completed: false },
    { title: "Packed", date: "", completed: false },
    { title: "Shipped", date: "", completed: false },
    { title: "Delivered", date: "", completed: false },
  ];

  // Mark steps completed based on status
  const statusOrder = ["Processing", "Packed", "Shipped", "Delivered"];

  const currentIndex = statusOrder.indexOf(status);

  if (status === "Cancelled") {
    return [
      { title: "Processing", date: created_at, completed: true },
      { title: "Cancelled", date: new Date().toISOString(), completed: true },
    ];
  }

  // Mark all steps up to current status as completed
  for (let i = 0; i <= currentIndex; i++) {
    steps[i].completed = true;
    steps[i].date = i === 0 ? created_at : new Date().toISOString();
  }

  return steps;
};


export const safeParse = (value, fallback = null) => {
  if (value == null) return fallback;

  if (typeof value === "string") {
    try {
      return safeParse(value);
    } catch {
      return fallback;
    }
  }

  return value;
};