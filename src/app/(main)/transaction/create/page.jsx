import { getAllAccounts } from "@/actions/dashboard";
import React, { Suspense } from "react";
import { defaultCategories } from "@/data/category";
import AddTransactionForm from "../_components/AddTransactionForm";
import { getTransaction } from "@/actions/transaction";
const page = async ({ searchParams }) => {
  const accounts = await getAllAccounts();

  const { edit } = await searchParams;

  let initialData = null;

  if(edit){
    const transaction = await getTransaction(edit);
    initialData = transaction;
  }

  return (
    <div className="max-w-2xl mx-auto px-5">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-title capitalize mb-8">
        Add Transaction
      </h1>

      <Suspense>
        <AddTransactionForm
          accounts={accounts?.data}
          categories={defaultCategories}
          editMode={!!edit}
          initialData={initialData?.data}
        />
      </Suspense>
    </div>
  );
};

export default page;
