"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";


const AccountCard = ({ account }) => {

  const { name, type, balance, isDefault, _id } = account;

  const {
    loading: updateDefaultAccountLoading,
    fn: updateDefaultAccountFn,
    error,
    data: updatedAccount,
  } = useFetch(updateDefaultAccount);

  const handleDefaultAccount = async (e) => {
    e.preventDefault();

    if (isDefault) {
      toast.error("You need alteast one default account");
      return;
    }

    await updateDefaultAccountFn(_id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated");
    }
  }, [updatedAccount, updateDefaultAccountLoading]);

  useEffect(() => {
    if (updatedAccount?.error) {
      toast.error(error);
    }
  }, [error, updatedAccount]);
  return (
    <Card className="group relative overflow-hidden border transition-all duration-200 hover:shadow-lg hover:border-blue-50">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold tracking-wide capitalize">
            {name}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {type?.charAt(0) + type?.slice(1).toLowerCase()} account
          </p>
        </div>

        <Switch
          checked={isDefault}
          onClick={handleDefaultAccount}
          disabled={updateDefaultAccountLoading}
        />
      </CardHeader>

      {/* Main content */}
      <Link href={`/account/${_id}`} className="block">
        <CardContent className="pt-0 pb-4">
          <div className="text-3xl font-semibold tracking-tight">
            ${parseFloat(balance).toFixed(2)}
          </div>

          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              Income
            </div>

            <div className="flex items-center gap-1">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              Expense
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Subtle hover accent */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </Card>
  );
};

export default AccountCard;
