"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, MoreHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Trash } from "lucide-react";
import { X } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { BulkDeleteTransaction } from "@/actions/transaction";
import { BarLoader } from "react-spinners";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

const RECURRING_TYPES = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const AccountTable = ({ accountId }) => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "asc",
  });
  const [search, setSearch] = useState("");
  const [recurringType, setRecurringType] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/transaction?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.data);
        setTotalPages(data.pagination.totalPages);
      });
  }, [page, accountId]);
  const visiblePages = 3;
  const PAGE_SIZE = 10;

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, recurringType]);

  useEffect(() => {
    const params = new URLSearchParams({
      page,
      limit: PAGE_SIZE,
      search,
      type: typeFilter,
      recurring: recurringType,
      sortField: sortConfig.field,
      sortDirection: sortConfig.direction,
    });

    fetch(`/api/accounts/${accountId}/transaction?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.data);
        setTotalPages(data.pagination.totalPages);
      });
  }, [page, accountId, search, typeFilter, recurringType, sortConfig]);

  const half = Math.floor(visiblePages / 2);

  const filteredTransaction = transactions;

  let startPage = Math.max(1, page - half);
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  // Fix window if we hit the end
  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }
  const handelSort = (field) => {
    if (sortConfig.field === field) {
      setSortConfig({
        field,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ field, direction: "asc" });
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringType) {
      const recurringFilter = recurringType;
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, search, typeFilter, recurringType, sortConfig]);

  const handelSelect = (id) => {
    setSelectedId((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const {
    data: transactiondata,
    loading: transactionLoading,
    fn: Deletefn,
    error,
  } = useFetch(BulkDeleteTransaction);

  const handelSelectAll = () => {
    setSelectedId(
      selectedId.length === filteredTransaction.length
        ? []
        : filteredTransaction.map((item) => item._id)
    );
  };

  const handelClearFilter = () => {
    setSelectedId([]);
    setSearch("");
    setTypeFilter("");
    setRecurringType("");
  };

  const handelBulkDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete these transactions?")
    ) {
      return;
    }

    Deletefn(selectedId);

    setTransactions((prev) =>
      prev.filter((tx) => !selectedId.includes(tx._id))
    );

    setSelectedId([]);
    setSearch("");
  };

  const handleSingleDelete = async (id) => {
    await Deletefn([id]); // MUST be array

    setTransactions((prev) => prev.filter((tx) => tx._id !== id));
  };

  useEffect(() => {
    if (transactiondata && !transactionLoading) {
      toast.success("Transaction deleted successfully");
    }
  }, [transactiondata, transactionLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <div className="space-y-2 px-0 lg:px-8">
      {transactionLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="mr-2 h-4 w-4 absolute top-2.5 left-3 text-muted-foreground" />
          <Input
            placeholder="Search"
            className={"pl-8"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="INCOME">INCOME</SelectItem>
                <SelectItem value="EXPENSE">EXPENSE</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={recurringType}
            onValueChange={(value) => setRecurringType(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">Non Recurring</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedId.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handelBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedId.length})
              </Button>
            </div>
          )}

          {(search || typeFilter || recurringType) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handelClearFilter}
              title="Clear filters"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">
                <Checkbox
                  onCheckedChange={handelSelectAll}
                  checked={selectedId.length === filteredTransaction.length}
                />
              </TableHead>
              <TableHead
                className="w-25 cursor-pointer"
                onClick={() => handelSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className=" cursor-pointer">Description</TableHead>
              <TableHead className=" cursor-pointer">
                <div
                  className="flex items-center"
                  onClick={() => handelSort("category")}
                >
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer">
                <div
                  className="flex items-center justify-end"
                  onClick={() => handelSort("amount")}
                >
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer">Recurring</TableHead>
              <TableHead className="w-12.5" />
            </TableRow>
          </TableHeader>
          {filteredAndSortedTransactions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="w-12.5">
                    <Checkbox
                      checked={selectedId.includes(transaction._id)}
                      onCheckedChange={() => handelSelect(transaction._id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="rounded-xl px-2 py-1 text-sm text-white"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "INCOME" ? "green" : "red",
                    }}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="cursor-pointer gap-1 bg-purple-200 text-purple-700 hover:bg-purple-300">
                            <RefreshCw className="w-3 h-3" />
                            {RECURRING_TYPES[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>

                        <TooltipContent side="top" align="start" sideOffset={6}>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction.nextRecurringDate),
                                "PP"
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        One Time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => router.push(
                            `/transaction/create?edit=${transaction._id}`
                          )}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleSingleDelete(transaction._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </Table>
      </div>
      <Pagination className={"my-10"}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={"cursor-pointer"}
            />
          </PaginationItem>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNumber) => {
            const isActive = page === pageNumber;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={isActive}
                  onClick={() => onPageChange(pageNumber)}
                  className={isActive ? "bg-primary text-white" : ""}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < totalPages && setPage(page + 1)}
              className={"cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AccountTable;
