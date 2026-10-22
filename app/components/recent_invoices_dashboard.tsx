"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInvoiceStore } from "../stores/invoice.store";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect } from "react";
import { formatDate } from "date-fns/format";

export default function RecentInvoicesDashboard() {

    const invoices = useInvoiceStore((s) => s.invoices);
    const getInvoices = useInvoiceStore((s) => s.getInvoices);

    const columns: ColumnDef<any>[] = [
        {
            id: "index",
            header: "No",
            cell: ({ row }) => row.index + 1
        },
        { accessorKey: "invoice_number", header: "Invoice Number" },
        { accessorKey: "partners.name", header: "Partner" },
        { accessorKey: "currency", header: "Currency", cell: ({ row }) => !row.original.currency ? "-" : row.original.currency },
        { accessorKey: "total_amount", header: "Amount" },
        { accessorKey: "issue_date", header: "Issue Date", cell: ({ row }) => formatDate(row.original.issue_date, "dd-MM-yyyy") },
        { accessorKey: "due_date", header: "Due Date", cell: ({ row }) => formatDate(row.original.due_date, "dd-MM-yyyy") },
        { accessorKey: "status", header: "Status" }
    ];

    const table = useReactTable({
        data: invoices,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

    });

    useEffect(() => {
        getInvoices();
    }, [getInvoices])

    return (
        <div className="">
            <p className="text-xl font-bold text-[var(--primary)]">Recent Invoices</p>
            <div className="bg-white rounded-xl mt-2.5">
                <Table className="[&_th]:px-6 [&_th]:py-3 [&_th]:text-[#1a1a1a] [&_th]:bg-white [&_td]:font-medium [&_td]:px-6 [&_td]:py-3 [&_th]:text-center text-center">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            invoices.length === 0 ? (
                                <TableRow>
                                    <TableHead colSpan={columns.length} className="h-24 text-center">
                                        No invoices found.
                                    </TableHead>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableHead key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}