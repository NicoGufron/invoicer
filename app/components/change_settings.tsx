"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, Info, Upload, X } from "lucide-react";
import { CompanyData, useCompanyStore } from "../stores/company.store";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "../stores/invoice.store";

export default function Settings() {

    const company = useCompanyStore((s) => s.company);
    const getCompany = useCompanyStore((s) => s.getCompany);
    const saveCompanyUpdate = useCompanyStore((s) => s.saveCompanyUpdate);
    const isUpdating = useCompanyStore((s) => s.isUpdating);

    const [companyTermsAndNotes, setCompanyTermsAndNotes] = useState<Partial<CompanyData>>();

    const [defaultCurrency, setDefaultCurrency] = useState("");
    
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const logoUrl = useInvoiceStore((s) => s.invoice.logoUrl);
    const setLogo = useInvoiceStore((s) => s.setLogo);
    const saveLogo = useInvoiceStore((s) => s.saveLogo);

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

        if (logoFile) {
            const resLogo = await saveLogo(logoFile);
            if (resLogo) toast.success("Logo updated");
        }

        if (res) toast.success("Changes saved",);
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

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setLogo(reader.result as string);
            setLogoFile(file);
        };
        reader.readAsDataURL(file);
    };

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
                    <div>
                        <p className="font-medium text-sm mb-5">Upload Logo</p>
                        <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}></Input>
                        {
                            logoUrl ? (
                                <div className="relative w-fit">
                                    <img src={logoUrl} alt="logo" className="h-50 w-50 object-cover rounded border border-border"></img>
                                    <button
                                        onClick={() => setLogo(null)}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-50 w-50 border-2 border-dashed flex flex-col items-center justify-center">

                                    <Button variant="outline" onClick={() => fileRef.current?.click()}>
                                        <Upload></Upload> Upload logo
                                    </Button>
                                </div>
                            )
                        }
                    </div>
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