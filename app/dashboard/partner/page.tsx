"use client";

import AddPartnerDialog from "@/app/components/add_partner_dialog";
import { usePartnerStore } from "@/app/stores/partner.store";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/lib/client";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { CheckIcon, ChevronDown, ChevronsUpDownIcon, Search } from "lucide-react";
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
            <h1 className="text-xl font-bold ">Partners</h1>
            <p className="text-xs text-muted-foreground">
                Manage your partners and their details.
            </p>
            <div className="grid grid-cols-3 gap-5 mt-10">
                <div className="flex flex-col gap-2.5">
                    <p className="text-xs">Find Company</p>
                    <InputGroup className="bg-[var(--background)]">
                        <InputGroupAddon align={"inline-start"}><Search></Search></InputGroupAddon>
                        <InputGroupInput placeholder="e.g Acme Incorporation" onChange={(e) => setGlobalFilter(e.currentTarget.value)}></InputGroupInput>
                    </InputGroup>
                </div>
                <div className="flex flex-col gap-2.5">
                    <p className="text-xs">Company Type</p>
                    <Popover>

                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="justify-between">Choose company type <ChevronsUpDownIcon></ChevronsUpDownIcon></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
                            <Command>
                                <CommandList>
                                    <CommandInput></CommandInput>
                                    <CommandEmpty>Type not found</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem>Client <CheckIcon></CheckIcon></CommandItem>
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
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