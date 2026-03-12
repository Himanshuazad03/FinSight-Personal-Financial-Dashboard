# FinSight - Personal Financial Dashboard

FinSight is a modern, comprehensive personal financial management platform designed to help users track spending, manage budgets, and gain actionable insights into their financial health. Built with a powerful tech stack, it features AI-powered receipt processing and multi-account management.

## 🚀 Features

- **Spending Analytics & Trends**: Visualize spending patterns with detailed charts and historical trends.
- **AI-Powered Receipt Processing**: Automatically extract and categorize transaction details from receipt images using Google Gemini AI.
- **Intelligent Budget Planning**: Set monthly budgets with smart recommendations based on historical data.
- **Multi-Account Management**: Track multiple bank accounts and credit cards in a single, unified view.
- **Automated Financial Insights**: Receive alerts for unusual spending, budget risks, and saving opportunities.
- **Recurring Transactions**: Manage subscriptions and regular bills with automated tracking.


## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Next.js Server Actions, Inngest (Background Jobs)
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **AI Engine**: Google Gemini AI (@google/generative-ai)
- **Security**: Arcjet (Rate limiting, Bot protection)
- **Emails**: React Email & Resend
- **Charts**: Recharts

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas instance)
- **Clerk Account** (For authentication)
- **Gemini AI API Key** (For receipt processing)
- **Resend API Key** (For email notifications)

## ⚙️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Himanshuazad03/FinSight-Personal-Financial-Dashboard.git
   cd finSight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ARCJET_KEY=your_arcjet_key
   GEMINI_API_KEY=your_gemini_key
   RESEND_API_KEY=your_resend_key
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run Inngest Dev Server (for background jobs):**
   ```bash
   npx inngest-cli@latest dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router (Pages and Layouts)
- `src/actions`: Server Actions for database operations
- `src/components`: Reusable UI components
- `src/models`: Mongoose schemas (User, Account, Transaction, Budget)
- `src/lib`: Shared libraries and configurations (Arcjet, Inngest)
- `src/hooks`: Custom React hooks
- `public`: Static assets (Logos, Icons)

## 📄 License

This project is open-source. Feel free to contribute or use it as a reference for your own projects.
