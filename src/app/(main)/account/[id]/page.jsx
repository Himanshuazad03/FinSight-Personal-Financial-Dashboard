import React, { Suspense } from "react";

import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import AccountTable from "../_components/AccountTable";
import { BarLoader } from "react-spinners";
import AccountChart from "../_components/AccountChart";

const page = async ({ params }) => {
  const { id } = await params;

  const result = await getAccountWithTransactions(id);

  if (!result) {
    notFound();
  }

  const { transactions, _count, ...account } = result;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {_count.transactions} Transactions
          </p>
        </div>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountTable accountId={id} />
      </Suspense>
    </div>
  );
};

export default page;
