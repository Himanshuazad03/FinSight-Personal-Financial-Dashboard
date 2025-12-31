import React from "react";
import CreateAccountDrawer from "../../../components/create-drawer";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetCard from "./_components/BudgetCard";
import { dashboardTransaction } from "@/actions/transaction";
import { DashboardOverview } from "./_components/DashboardOverview";


const page = async () => {
  const result = await getAllAccounts();
  const transactions = await dashboardTransaction();
  const accounts = result?.data ?? [];



  const defaultAccount = accounts?.find((account) => account?.isDefault);

  const budget = await getCurrentBudget(defaultAccount?._id);

  return (
    <div className="px-5">
      <BudgetCard
        initialBudget={budget?.budget}
        currentExpenses={budget?.currentExpenses || 0}
      />

      <DashboardOverview
        accounts={accounts || []}
        transactions={transactions.data || []}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 && (
          <>
            {accounts?.map((account) => (
              <AccountCard key={account._id} account={account} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default page;
