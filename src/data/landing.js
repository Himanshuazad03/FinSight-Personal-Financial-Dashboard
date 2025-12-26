import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "10+",
    label: "Active Users",
  },
  {
    value: "$500+",
    label: "Transactions Tracked",
  },
  {
    value: "97.9%",
    label: "Uptime",
  },
  {
    value: "4.8/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Spending Analytics & Trends",
    description:
      "Analyze spending behavior through detailed visual insights, helping users understand patterns and make informed financial decisions.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "AI-Powered Receipt Processing",
    description:
      "Automatically extract and categorize transaction details from receipts, reducing manual entry and improving accuracy.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Intelligent Budget Planning",
    description:
      "Plan and manage monthly budgets with smart recommendations that adapt based on spending habits and historical data.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Management",
    description:
      "Manage multiple bank accounts and credit cards from a single dashboard for a unified financial overview.",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multi-Currency Support",
    description:
      "Track expenses across different currencies with real-time conversion for accurate and consistent financial reporting.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Financial Insights",
    description:
      "Receive automated insights and alerts that highlight unusual spending, budget risks, and opportunities to save.",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-7 w-7 text-blue-500" />,
    title: "Create Your Account",
    description:
      "Sign up securely to access your personal dashboard and start managing your finances with confidence.",
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-blue-500" />,
    title: "Track & Organize Spending",
    description:
      "Add or sync transactions to automatically categorize expenses and maintain a clear financial overview.",
  },
  {
    icon: <PieChart className="h-7 w-7 text-blue-500" />,
    title: "Gain Actionable Insights",
    description:
      "Leverage AI-driven analysis to identify spending patterns, receive insights, and make informed decisions.",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Animesh Porwal",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "FinSight helped me clearly track my monthly expenses and understand where I was overspending. The insights made budgeting much easier without feeling overwhelming.",
  },
  {
    name: "Koushik Pali",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    quote:
      "I used to manually note expenses in different apps. With FinSight, everything is organized in one place, and the receipt scanning feature saves a lot of time.",
  },
  {
    name: "Harshit Yadav",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    quote:
      "The budget alerts and spending breakdowns helped me control unnecessary expenses. I’ve already recommended FinSight to a few friends who struggle with tracking money.",
  },
  {
    name: "Harshil Jain",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Seeing my expenses broken down clearly helped me realize how small daily spends add up. FinSight made it easier to stay mindful without constantly tracking everything manually.",
  },
  {
  name: "Priyanshu Azad",
  image: "https://randomuser.me/api/portraits/men/61.jpg",
  quote:
    "Before using FinSight, I had no clear idea where my money was going each month. The visual breakdown helped me spot unnecessary spending quickly and adjust my budget.",
},
{
  name: "Harsh Yadav",
  image: "https://randomuser.me/api/portraits/women/52.jpg",
  quote:
    "What I liked most was how simple everything felt. I didn’t need to learn complex tools—just add transactions and the dashboard made sense immediately.",
}

];
