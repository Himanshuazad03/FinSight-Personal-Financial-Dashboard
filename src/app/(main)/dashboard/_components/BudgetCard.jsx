"use client";
import React, { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { updateBudget } from "@/actions/budget";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { toast } from "sonner";

const BudgetCard = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [budget, setBudget] = React.useState(
    initialBudget?.amount.toString() || 0
  );

  const {
    data: budgetData,
    error,
    fn: updateBudgetFn,
    loading: updateBudgetLoading,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? Math.min(100, (currentExpenses / initialBudget.amount) * 100)
    : 0;

  const handelUpdateBudget = async () => {
    const amount = parseFloat(budget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid budget amount");
      return;
    }
    await updateBudgetFn(budget);
    setIsEditing(false);
  };

  useEffect(() => {
    if (initialBudget?.amount) {
      setBudget(initialBudget.amount.toString());
    }
  }, [initialBudget?.amount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (budgetData?.success) {
      toast.success("Budget updated successfully");
    }
  }, [budgetData, updateBudgetLoading]);

  const handleCancel = () => {
    setBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  return (
    <Card className={"mb-5"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={updateBudgetLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handelUpdateBudget}
                  disabled={updateBudgetLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={updateBudgetLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `₹${currentExpenses.toFixed(
                        2
                      )} of ₹${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              extraStyles={`${
                // add to Progress component
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(2)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
