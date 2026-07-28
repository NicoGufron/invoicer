"use client"

import { useInvoiceStore } from "@/app/stores/invoice.store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandInput } from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { CalendarIcon, ChevronDown, ChevronUp, Pencil, Receipt, Search, StickyNoteIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ViewInvoices() {

    const invoices = useInvoiceStore((s) => s.invoices);
    const getInvoices = useInvoiceStore((s) => s.getInvoices);
    const deleteInvoice = useInvoiceStore((s) => s.deleteInvoice);
    const isLoading = useInvoiceStore((s) => s.isLoading);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [globalFilter, setGlobalFilter] = useState("");

    const router = useRouter();

    const handleDelete = async (invoiceId: number) => {
        const res = await deleteInvoice(invoiceId);

        if (res) {
            toast.success("Invoice deleted successfully");
        }
    }

    const columns: ColumnDef<any>[] = [
        {
            id: "index",
            header: "No",
            cell: ({ row }) => row.index + 1
        },
        { accessorKey: "invoice_number", header: "Invoice Number" },
        { accessorKey: "partners.name", header: "Client Name" },
        { accessorKey: "partners.email", header: "Client Email" },
        {
            accessorKey: "total_amount",
            header: "Total Amount",
            cell: ({ row }) => {
                const original = row.original;
                const currency = original.currency;
                const totalAmount = original.total_amount;
                let currencySymbol;

                if (currency === "IDR") {
                    currencySymbol = "Rp." + Number(totalAmount).toLocaleString("id-ID");
                } else if (currency === "USD") {
                    currencySymbol = "$" + Number(totalAmount + 1000).toLocaleString("en-US");
                }

                return (
                    <p>{currencySymbol}</p>
                )
            }
        },
        {
            accessorKey: "issue_date",
            header: "Issue Date",
            cell: ({ row }) => {
                const issueDate = row.original.issue_date;
                return (
                    <p>{formatDate(issueDate, "dd-MM-yyyy")}</p>
                )
            }
        },
        {
            accessorKey: "due_date",
            header: "Due Date",
            cell: ({ row }) => {
                const dueDate = row.original.due_date;
                return (
                    <p>{formatDate(dueDate, "dd-MM-yyyy")}</p>
                )
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <span className={`border-1 rounded-lg shadow-sm p-2 px-8 ${status === 'DRAFT' ? "bg-gray-400 text-white" : ""}`}>
                        {status === "DRAFT" ? "Draft" : ""}
                    </span>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const invoice = row.original;
                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-[#25343F] hover:bg-[#25343F]/95 w-full cursor-pointer">
                                    Action <ChevronDown></ChevronDown>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => router.push(`./edit/${invoice.id}`)}>
                                        <Pencil />Edit Invoice
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator></DropdownMenuSeparator>
                                    <DropdownMenuItem variant="destructive" onClick={() => {
                                        // deleteInvoice(invoice.id)
                                        setOpenDeleteDialog(true);
                                    }}><Trash />Delete Invoice</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                </DialogHeader>
                                <p>Doing this will delete the invoice permanently!</p>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="ghost">Cancel</Button>
                                    </DialogClose>
                                    <Button variant={"destructive"} onClick={() => {
                                        handleDelete(invoice.id)
                                    }}>{isLoading ? <Spinner></Spinner> : "Delete Invoice"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog >
                    </>

                )
            }
        }
    ]

    const table = useReactTable({
        data: invoices,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        state: {
            globalFilter,
        }
    });

    useEffect(() => {
        getInvoices();
    }, [getInvoices])

    return (
        <section className="p-6 h-screen flex flex-col">
            <h1 className="text-2xl font-bold">View Invoices</h1>
            <div className="grid grid-cols-3 mt-5 gap-5">
                <div className="flex flex-col gap-2.5">
                    <p className="text-xs">Client Name</p>
                    <InputGroup className="bg-[var(--background)]">
                        <InputGroupAddon align={"inline-start"}><Search></Search></InputGroupAddon>
                        <InputGroupInput onChange={(e) => setGlobalFilter(e.currentTarget.value)}></InputGroupInput>
                    </InputGroup>
                </div>
                <div className="flex flex-col gap-2.5">
                    <p className="text-xs">Issue Date</p>
                    <Popover>
                        <PopoverTrigger>
                            <Button className={"w-full justify-start text-muted-foreground"} variant="outline"><CalendarIcon></CalendarIcon></Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar></Calendar>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-2.5">
                    <p className="text-xs">Due Date</p>
                    <Popover>
                        <PopoverTrigger>

                            <Button variant="outline" className={"w-full justify-start text-muted-foreground"}><CalendarIcon></CalendarIcon></Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar></Calendar>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-white rounded-lg border-1 border-gray-200 shadow-sm mt-5">
                    <Table className="[&_th]:px-6 [&_th]:py-3 [&_th]:text-gray-500 [&_th]:bg-gray-50 [&_td]:font-medium [&_td]:px-6 [&_td]:py-3 [&_th]:text-center text-center">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>{headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}

                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {
                                invoices.length > 0 ?
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow className="*:border-border [&>:not(:last-child)]:border-r" key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )) : <TableRow>
                                        <TableCell colSpan={columns.length}>
                                            <div className="flex flex-col items-center justify-center gap-5 p-5">
                                                <span className="p-2.5 rounded-xl border bg-gray-500/9"><StickyNoteIcon></StickyNoteIcon></span>
                                                <p className="font-bold">No invoices found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}