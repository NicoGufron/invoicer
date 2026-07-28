"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, Info } from "lucide-react";
import { CompanyData, useCompanyStore } from "../stores/company.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export default function Settings() {

    const company = useCompanyStore((s) => s.company);
    const getCompany = useCompanyStore((s) => s.getCompany);
    const saveCompanyUpdate = useCompanyStore((s) => s.saveCompanyUpdate);
    const isUpdating = useCompanyStore((s) => s.isUpdating);

    const [companyTermsAndNotes, setCompanyTermsAndNotes] = useState<Partial<CompanyData>>();

    const [defaultCurrency, setDefaultCurrency] = useState("");

    useEffect(() => {
        getCompany();
    }, [getCompany])

    const handleChange = (key: keyof CompanyData, e: any) => {
        setCompanyTermsAndNotes(prev => ({
            ...prev,
            [key]: e,
        }));
    }

    const handleUpdateCompany = async () => {
        if (!company) return;

        const res = await saveCompanyUpdate(company.id, companyTermsAndNotes!);

        if (res) toast.success("Changes saved",)
    }

    useEffect(() => {
        setCompanyTermsAndNotes(company!);
    }, [])

    const CURRENCIES = [
        {
            value: "$",
            code: "USD",
            label: "US Dollar"
        },
        {
            value: "€",
            code: "EUR",
            label: "Euro"
        },
        {
            value: "£",
            code: "GBP",
            label: "British Pound",
        },
        {
            value: "Rp",
            code: "IDR",
            label: "Indonesian Rupiah"
        }
    ]

    return (
        <div className="py-5">
            <Item variant={"outline"} className="bg-blue-50 w-full ">
                <ItemMedia><Info size={16}></Info></ItemMedia>
                <ItemContent>
                    <ItemTitle className="font-bold">Attention</ItemTitle>
                    <ItemDescription className="text-black">Changes will be saved and applied to future invoices automatically</ItemDescription>
                </ItemContent>
            </Item>
            <div>
                <div className="flex flex-col gap-5 mt-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex flex-col items-start gap-2.5">
                            <p className="font-medium text-sm">Set Default Currency</p>
                            <Popover>
                                <PopoverTrigger asChild className="w-full">
                                    <Button variant="outline" className="justify-between">$ USD - US Dollar<ChevronDownIcon /></Button>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <Command>
                                        <CommandInput></CommandInput>
                                        <CommandList>
                                            <CommandGroup>
                                                {CURRENCIES.map((c) => (
                                                    <CommandItem key={c.value} onSelect={(e) => {
                                                        setDefaultCurrency(c.value)
                                                    }}>{c.value + " " + c.code + " - " + c.label}</CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col">
                            <Field>
                                <FieldLabel>Default Invoice Format</FieldLabel>
                                <div className="flex flex-row gap-2.5 items-center">
                                    <Input placeholder="INV" className="w-1/8" maxLength={3}></Input>
                                    -
                                    <Input placeholder="001" className="w-full"></Input>

                                </div>
                            </Field>
                        </div>
                    </div>
                    <Field>
                        <FieldLabel>Notes</FieldLabel>
                        <Textarea rows={3} defaultValue={company?.default_notes} onChange={(e) => handleChange('default_notes', e.currentTarget.value)}></Textarea>
                    </Field>
                    <Field>
                        <FieldLabel>Terms</FieldLabel>
                        <Textarea rows={3} defaultValue={company?.default_terms} onChange={(e) => handleChange('default_terms', e.currentTarget.value)}></Textarea>
                    </Field>
                </div>
                <Button className="mt-5" onClick={handleUpdateCompany}>{isUpdating ? <Spinner></Spinner> : "Save changes"}</Button>
            </div>
        </div >
    )
}