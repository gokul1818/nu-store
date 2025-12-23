export const formatCurrency = (n) => {
  if (n == null) return "₹0";
  return `₹${Number(n).toFixed(2)}`;
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

// utils/helpers.js

/**
 * Safely parse JSON strings
 * Returns the parsed data or a default value if parsing fails
 */
export const safeParse = (data, defaultValue = []) => {
  // If data is null or undefined, return default
  if (data == null) return defaultValue;

  // If data is already an array or object, return it
  if (typeof data === "object") return data;

  // If data is a string, try to parse it
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return parsed;
    } catch (e) {
      console.error("JSON parse error:", e, "Data:", data);
      return defaultValue;
    }
  }

  // For any other type, return default
  return defaultValue;
};

/**
 * Format currency in INR
 */
export const formatCurrencyINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Build product query string
 */
export const buildProductQuery = (params) => {
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  return queryParams.toString();
};
