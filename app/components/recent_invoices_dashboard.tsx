"use client"

import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInvoiceStore } from "../stores/invoice.store";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect } from "react";

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
        { accessorKey: "total_amount", header: "Amount" },
        { accessorKey: "issue_date", header: "Issue Date" },
        { accessorKey: "due_date", header: "Due Date" },
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
            <p className="text-xl font-bold">Recent Invoices</p>
            <div className="bg-white rounded-xl">
                <Table>
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
                </Table>
            </div>
        </div>
    );
}