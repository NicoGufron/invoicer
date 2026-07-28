"use client";

import AddPartnerDialog from "@/app/components/add_partner_dialog";
import { usePartnerStore } from "@/app/stores/partner.store";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/client";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function PartnerPage() {

    // const supabase = createClient();

    const { isLoading, partners, getPartners } = usePartnerStore();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        const fetchPartners = async () => {
            await getPartners();
        }

        fetchPartners();
    }, [])

    const columns: ColumnDef<any>[] = [
        { id: "index", header: "No", cell: ({ row }) => row.index + 1 },
        { accessorKey: "name", header: "Company Name" },
        { accessorKey: "email", header: "Company Email" },
        { accessorKey: "phone", header: "Company Phone" },
        { accessorKey: "address", header: "Company Address" },
        { accessorKey: "type", header: "Company Type" },
        {
            id: "actions",
            cell: ({ row }) => {
                const company = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}>Actions <ChevronDown></ChevronDown></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Edit Partner</DropdownMenuItem>
                                <DropdownMenuItem>View Detail Partner</DropdownMenuItem>
                                <DropdownMenuItem variant="destructive">Delete Partner</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>

                    </DropdownMenu >
                )
            }
        }
    ]

    const table = useReactTable({
        data: partners,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        }
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Partners</h1>
            <div className="flex flex-col gap-2.5 w-1/3 mt-10">
                <p className="text-xs">Find Company</p>
                <InputGroup className="bg-[var(--background)]">
                    <InputGroupAddon align={"inline-start"}><Search></Search></InputGroupAddon>
                    <InputGroupInput onChange={(e) => setGlobalFilter(e.currentTarget.value)}></InputGroupInput>
                </InputGroup>
            </div>
            <div className="bg-white border-1 rounded-xl mt-10">

                <div className="flex justify-end p-2.5">
                    <AddPartnerDialog id={""}></AddPartnerDialog>
                </div>
                <Table className="[&_th]:px-6 [&_th]:border-t-1 [&_th]:py-3 [&_th]:text-gray-500 [&_td]:font-medium [&_td]:px-6 [&_td]:py-3 [&_th]:text-center text-center">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="">{headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}</TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <div className="flex flex-col justify-center items-center gap-5 m-5">
                                            <Spinner className="size-8"></Spinner>
                                            <p>Loading data, please wait</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) :
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}