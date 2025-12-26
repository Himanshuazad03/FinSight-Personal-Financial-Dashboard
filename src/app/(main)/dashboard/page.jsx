import React from "react";
import CreateAccountDrawer from "../../../components/create-drawer";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/AccountCard";

const page = async () => {
  const result = await getAllAccounts();
  const accounts = result?.data ?? [];

  return (
    <div className="px-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
