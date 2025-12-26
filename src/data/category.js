export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#16a34a", // emerald-600 (strong, stable)
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#0891b2", // cyan-600 (modern, techy)
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "INCOME",
    color: "#4f46e5", // indigo-600 (trust, growth)
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business",
    type: "INCOME",
    color: "#be185d", // rose-700 (executive, premium)
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental",
    type: "INCOME",
    color: "#d97706", // amber-600 (assets, property)
    icon: "Home",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "INCOME",
    color: "#475569", // slate-600 (neutral fallback)
    icon: "Plus",
  },

  // Expense Categories
  {
    id: "housing",
    name: "Housing",
    type: "EXPENSE",
    color: "#dc2626", // red-600 (major fixed cost)
    icon: "Home",
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "EXPENSE",
    color: "#ea580c", // orange-600 (movement, energy)
    icon: "Car",
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#65a30d", // lime-600 (daily essentials)
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#0284c7", // sky-600 (services)
    icon: "Zap",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#7c3aed", // violet-600 (fun, non-essential)
    icon: "Film",
  },
  {
    id: "food",
    name: "Food",
    type: "EXPENSE",
    color: "#e11d48", // rose-600 (frequent spending)
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "EXPENSE",
    color: "#db2777", // pink-600 (consumer spending)
    icon: "ShoppingBag",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "EXPENSE",
    color: "#0d9488", // teal-600 (trust, care)
    icon: "HeartPulse",
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#4338ca", // indigo-700 (long-term value)
    icon: "GraduationCap",
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "EXPENSE",
    color: "#a21caf", // fuchsia-700 (lifestyle)
    icon: "Smile",
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#0369a1", // sky-700 (exploration)
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "EXPENSE",
    color: "#475569", // slate-600 (serious, neutral)
    icon: "Shield",
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "EXPENSE",
    color: "#db2777", // pink-600 (emotional spend)
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "EXPENSE",
    color: "#be123c", // rose-700 (unpleasant but necessary)
    icon: "Receipt",
  },
  {
    id: "other-expense",
    name: "Other Expenses",
    type: "EXPENSE",
    color: "#64748b", // slate-500 (fallback)
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});
