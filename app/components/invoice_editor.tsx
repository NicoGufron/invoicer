"use client"

import { useRef, useState } from "react";
import { InvoiceData, LineItem, useInvoiceStore } from "../stores/invoice.store";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";

export default function InvoiceEditor() {
    return (
        <div className="flex flex-col gap-6 overflow-y-auto p-5 h-full">
            <LogoSection></LogoSection>
            <hr></hr>
            <div className="grid grid-cols-2 gap-5">
                <SenderSection></SenderSection>
                <ClientSection></ClientSection>
            </div>
            <hr></hr>
            <MetaSection></MetaSection>
            <hr></hr>
            <LineItemsSections></LineItemsSections>
            <hr></hr>
            <FinancialsSection></FinancialsSection>
            <hr></hr>
            <NotesSection></NotesSection>
        </div>
    );
}

function LogoSection() {
    const fileRef = useRef<HTMLInputElement>(null);
    const logoUrl = useInvoiceStore((s) => s.invoice.logoUrl);
    const setLogo = useInvoiceStore((s) => s.setLogo);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setLogo(ev.target?.result as string);
        reader.readAsDataURL(file);
    }

    return (
        <div>
            <p className="font-bold text-xl">Upload Logo</p>
            <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}></Input>
            {
                logoUrl ? (
                    <div className="relative w-fit">
                        <img src="logoUrl" alt="logo" className="h-14 object-contain rounded border border-border"></img>
                        <button
                            onClick={() => setLogo(null)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ) : (
                    <Button variant="outline" className="gap-2 border-dashed" onClick={() => fileRef.current?.click()}>
                        <Upload></Upload> Upload logo
                    </Button>
                )
            }
        </div>
    )
}

function SenderSection() {
    const companyName = useInvoiceStore((s) => s.invoice.companyName);
    const companyAddress = useInvoiceStore((s) => s.invoice.companyAddress);
    const companyEmail = useInvoiceStore((s) => s.invoice.companyEmail);

    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    const handleChange = (key: keyof InvoiceData, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateInvoice({
            [key]: e.currentTarget.value
        })
    }

    return (
        <div>
            <p className="text-xl font-bold">Your Details</p>
            <div className="flex flex-col gap-3 py-5">
                <FieldGroup>
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input value={companyName} onChange={(e) => handleChange("companyName", e)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Company Email</FieldLabel>
                        <Input value={companyEmail} onChange={(e) => handleChange("companyEmail", e)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Company Address</FieldLabel>
                        <Textarea value={companyAddress} onChange={(e) => handleChange("companyAddress", e)}></Textarea>
                    </Field>
                </FieldGroup>
            </div>
        </div>
    )
}

function ClientSection() {
    const clientName = useInvoiceStore((s) => s.invoice.clientName);
    const clientEmail = useInvoiceStore((s) => s.invoice.clientEmail);
    const clientAddress = useInvoiceStore((s) => s.invoice.clientAddress);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    const handleChange = (key: keyof InvoiceData, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateInvoice({
            [key]: e.currentTarget.value
        })
    }

    return (
        <div>
            <p className="text-xl font-bold">Bill To</p>
            <div className="flex flex-col gap-3 py-5">
                <FieldGroup>

                    <Field>
                        <FieldLabel>Client Name</FieldLabel>
                        <Input value={clientName} onChange={(e) => handleChange('clientName', e)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Client Address</FieldLabel>
                        <Input value={clientAddress} onChange={(e) => handleChange('clientAddress', e)}></Input>
                    </Field>
                    <Field>
                        <FieldLabel>Client Email</FieldLabel>
                        <Textarea value={clientEmail} onChange={(e) => handleChange('clientEmail', e)}></Textarea>
                    </Field>
                </FieldGroup>
            </div>
        </div>
    );
}

function MetaSection() {
    const invoiceNumber = useInvoiceStore((s) => s.invoice.invoiceNumber);
    const issueDate = useInvoiceStore((s) => s.invoice.issueDate);
    const dueDate = useInvoiceStore((s) => s.invoice.dueDate);

    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    const [issueDateOpen, setIssueDateOpen] = useState(false);
    const [dueDateOpen, setDueDateOpen] = useState(false);


    const handleChange = (key: keyof InvoiceData, e: any) => {
        updateInvoice({
            [key]: e
        })
    }

    return (
        <div>
            <p className="text-xl font-bold">Invoice Details</p>
            <div className="flex flex-col gap-3 py-5">
                <Field>
                    <FieldLabel>Invoice Number</FieldLabel>
                    <Input value={invoiceNumber} onChange={(e) => handleChange("invoiceNumber", e)}></Input>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field>
                        <FieldLabel>Issue Date</FieldLabel>
                        <Popover onOpenChange={setIssueDateOpen} open={issueDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between">
                                    {format(issueDate, "d MMMM yyyy")}
                                    <ChevronDownIcon></ChevronDownIcon>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="center">
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        const year = date!.getFullYear();
                                        const month = String(date!.getMonth() + 1).padStart(2, '0');
                                        const day = String(date!.getDate()).padStart(2, '0');
                                        const localDate = `${year}-${month}-${day}`;
                                        handleChange('issueDate', localDate);
                                        setIssueDateOpen(false);
                                    }}>

                                </Calendar>
                            </PopoverContent>
                        </Popover>
                    </Field>
                    <Field>
                        <FieldLabel>Due Date</FieldLabel>
                        <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between">
                                    {format(dueDate, "d MMMM yyyy")}
                                    <ChevronDownIcon></ChevronDownIcon>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="center">
                                <Calendar mode="single"
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        const year = date!.getFullYear();
                                        const month = String(date!.getMonth() + 1).padStart(2, '0');
                                        const day = String(date!.getDate()).padStart(2, '0');
                                        const localDate = `${year}-${month}-${day}`;
                                        handleChange('dueDate', localDate);
                                        setDueDateOpen(false);
                                    }}>

                                </Calendar>
                            </PopoverContent>
                        </Popover>
                    </Field>
                </div>
            </div>
        </div>
    );
}

function LineItemRow({ item }: { item: LineItem }) {
    const updateItem = useInvoiceStore((s) => s.updateItem);
    const removeItem = useInvoiceStore((s) => s.removeItem);

    const CURRENCIES = [
        {
            value: "$",
            label: "US Dollar"
        },
        {
            value: "€",
            label: "Euro"
        },
        {
            value: "£",
            label: "British Pound",
        },
        {
            value: "Rp",
            label: "Indonesian Rupiah"
        }
    ]

    const [currency, setCurrency] = useState("$");

    return (
        <div className="grid grid-cols-[1fr_2fr_5rem_7rem_2.5rem] gap-2 items-center rounded-md px-2 py-1.5 border">
            <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.currentTarget.value })}></Input>
            <Input value={item.description} onChange={(e) => updateItem(item.id, { description: e.currentTarget.value })}></Input>
            <Input value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.currentTarget.value) || 0 })}></Input>
            <ButtonGroup>
                <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>{currency}</SelectTrigger>
                    <SelectContent className="min-w-24">
                        <SelectGroup>
                            {CURRENCIES.map((currency) => (
                                <SelectItem key={currency.value} value={currency.value}>
                                    {currency.value}{" "}
                                    <span>
                                        {currency.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input value={item.rate} onChange={(e) => updateItem(item.id, { rate: parseFloat(e.currentTarget.value) || 0 })}></Input>

            </ButtonGroup>
            <Button variant="destructive" onClick={() => removeItem(item.id)}>
                <Trash2></Trash2>
            </Button>
        </div>
    );
}

function LineItemsSections() {
    const items = useInvoiceStore((s) => s.invoice.items);
    const addItem = useInvoiceStore((s) => s.addItem);

    return (
        <div>
            <p className="text-xl font-bold">Items</p>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_2fr_5rem_rem_2.5rem] gap-2 px-1">
                    {["Name", "Description", "Quantity", "Rate", ""].map((h) => (
                        <span key={h} className="text-[10px] uppercase tracking-widest font-medium">{h}</span>
                    ))}
                </div>
                {items.map((item) => (
                    <LineItemRow key={item.id} item={item}></LineItemRow>
                ))}
                <Button variant={"outline"} onClick={addItem} className="gap-2 border-dashed mt-1">
                    <Plus></Plus> Add Item
                </Button>
            </div>
        </div>
    )
}

function FinancialsSection() {
    const taxRate = useInvoiceStore((s) => s.invoice.taxRate);
    const discountRate = useInvoiceStore((s) => s.invoice.discountRate);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    const handleChange = (key: keyof InvoiceData, e: React.ChangeEvent<HTMLInputElement>) => {
        updateInvoice({
            [key]: parseFloat(e.currentTarget.value)
        })
    }

    return (
        <div>
            <p className="text-xl font-bold">Tax & Discount</p>
            <div className="grid grid-cols-2 gap-3">
                <Field>
                    <FieldLabel>Discount (%)</FieldLabel>
                    <Input value={discountRate} onChange={(e) => handleChange('discountRate', e)}></Input>
                </Field>
                <Field>
                    <FieldLabel>Tax / VAT (%)</FieldLabel>
                    <Input value={taxRate} onChange={(e) => handleChange('taxRate', e)}></Input>
                </Field>
            </div>
        </div>
    );
}

function NotesSection() {
    const notes = useInvoiceStore((s) => s.invoice.notes);
    const terms = useInvoiceStore((s) => s.invoice.terms);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    const handleChange = (key: keyof InvoiceData, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateInvoice(
            { [key]: e.currentTarget.value }
        )
    }

    return (
        <div>
            <p className="text-xl font-bold">Notes & Terms</p>
            <div className="flex flex-col gap-3">
                <Field>
                    <FieldLabel>Notes</FieldLabel>
                    <Textarea rows={3} value={notes} onChange={(e) => handleChange("notes", e)} placeholder="Thank you for your business!"></Textarea>
                </Field>
                <Field>
                    <FieldLabel>Terms</FieldLabel>
                    <Textarea value={terms} onChange={(e) => handleChange("terms", e)} placeholder="Payment due within 30 days"></Textarea>
                </Field>
            </div>
        </div>
    )
}