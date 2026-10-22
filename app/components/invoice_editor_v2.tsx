"use client"

import { useEffect, useRef, useState } from "react";
import { InvoiceData, LineItem, useInvoiceStore } from "../stores/invoice.store";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ChevronDownIcon, EyeIcon, FileJson, NotepadTextDashed, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ButtonGroup } from "@/components/ui/button-group";
import { Partner, usePartnerStore } from "../stores/partner.store";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn, fmt, formatDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useCompanyStore } from "../stores/company.store";
import { registerFonts } from "@/lib/helper";

interface Props {
    user: any,
    id?: string,
    showPreview: boolean,
    onPreview: () => void,
    demo?: boolean,
}

export default function InvoiceEditorV2({ user, id, showPreview, demo, onPreview }: Props) {

    const companyName = useInvoiceStore((s) => s.invoice.companyName);
    const companyAddress = useInvoiceStore((s) => s.invoice.companyAddress);
    const companyEmail = useInvoiceStore((s) => s.invoice.companyEmail);
    const companyNumber = useInvoiceStore((s) => s.invoice.companyNumber);

    const getCompany = useCompanyStore((c) => c.getCompany);
    const userCompany = useCompanyStore((c) => c.company);

    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);


    const invoice = useInvoiceStore((s) => s.invoice);
    // const editInvoice = useInvoiceStore((s) => s.invoice);
    const resetInvoice = useInvoiceStore((s) => s.resetInvoice);
    const getInvoice = useInvoiceStore((s) => s.getInvoice);
    const saveDraftInvoice = useInvoiceStore((s) => s.saveDraftInvoice);
    const handleSaveDraft = async (id?: string) => {
        const res = await saveDraftInvoice(id);

        if (res) {
            toast.success("Invoice succesfully saved as draft");
        }

    }

    const handleExport = async (format?: string) => {
        if (format === "pdf") {
            const { default: jsPDF } = await import("jspdf");
            const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const right = pageWidth - margin;

            await registerFonts(pdf);

            const itemAmount = (item: LineItem) => {
                const gross = item.quantity * item.rate;
                const discount = item.discountType === "percentage"
                    ? gross * item.discount / 100
                    : item.discount;
                return gross - discount;
            };

            pdf.setFillColor(67, 56, 202);
            pdf.rect(0, 0, pageWidth, 5, "F");

            if (invoice.logoUrl) {
                const logoData = invoice.logoUrl.startsWith("data:") 
                ? invoice.logoUrl 
                : await fetch(invoice.logoUrl).then((async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch logo");
                    }

                    const blob = await res.blob();
                    return await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                }))

                const image = new Image();
                image.src = logoData;
                await image.decode();

                const maxWidth = 30;
                const maxHeight = 30;
                const scale = Math.min(
                    maxWidth / image.width, 
                    maxHeight / image.height
                );

                const width = image.naturalWidth * scale;
                const height = image.naturalHeight * scale;
                const format = logoData.startsWith("data:image/jpeg") ? "JPEG" : "PNG";

                pdf.addImage(logoData, format, margin, 10, width, height);
            }
            pdf.setCharSpace(0.5);
            pdf.setFont("Jakarta", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor(130, 130, 130);
            pdf.text("INVOICE", right-2, 14, { align: "right" });
            // pdf.setFont("helvetica", "bold");
            // pdf.setFontSize(22);
            // pdf.text("INVOICE", margin, 22);
            pdf.setCharSpace(0);

            pdf.setFontSize(18);
            pdf.setFont("Geist Mono", "semibold");
            pdf.setTextColor(67, 56, 202);
            pdf.text(invoice.invoiceNumber || "INV-001", right, 22, { align: "right" });

            const addContact = (
                title: string,
                values: (string | undefined)[],
                x: number,
                y: number,
                width: number,
                ruleAfterTitle = false,
            ) => {
                pdf.setTextColor(130, 130, 130);
                pdf.setFont("Jakarta", "normal");
                pdf.setFontSize(8);
                pdf.setCharSpace(0.5);

                pdf.text(title.toUpperCase(), x, y);
                if (ruleAfterTitle) {
                    pdf.setDrawColor(235, 235, 235);
                    pdf.line(x, y + 3, x + width, y + 3);
                    y += 9;
                } else {
                    y += 5;
                }
                pdf.setCharSpace(0);
                pdf.setTextColor(40, 40, 40);
                pdf.setFont("Jakarta", "bold");
                pdf.setFontSize(12);
                const name = values[0] || "-";
                const nameLines = pdf.splitTextToSize(name, width);
                pdf.text(nameLines, x, y);
                y += nameLines.length * 4.5;
                pdf.setFont("Jakarta", "normal");
                pdf.setTextColor(100, 100, 100);
                pdf.setFontSize(8);
                for (const value of values.slice(1)) {
                    if (!value) continue;
                    const lines = pdf.splitTextToSize(value, width);
                    pdf.text(lines, x, y);
                    y += lines.length * 4;
                }
                return y;
            };

            const senderBottom = addContact("", [
                invoice.companyName,
                invoice.companyAddress,
                invoice.companyEmail,
                invoice.companyNumber ? `Tel: ${invoice.companyNumber}` : undefined,
            ], margin, 37, 85);

            pdf.setFont("Jakarta", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Issued: ${formatDate(invoice.issueDate) || "-"}`, right, 32, { align: "right" });
            pdf.text(`Due: ${formatDate(invoice.dueDate) || "-"}`, right, 37, { align: "right" });

            const clientBottom = addContact("Bill to", [
                invoice.clientName,
                invoice.clientAddress,
                invoice.clientEmail,
                invoice.clientNumber ? `Tel: ${invoice.clientNumber}` : undefined,
            ], margin, senderBottom + 15, pageWidth - margin * 2, true);

            const columns = [
                { label: "NAME", x: margin, width: 30, align: "left" as const },
                { label: "DESCRIPTION", x: 49, width: 49, align: "left" as const },
                { label: "QUANTITY", x: 99, width: 18, align: "right" as const },
                { label: "DISCOUNT", x: 118, width: 25, align: "right" as const },
                { label: "RATE", x: 144, width: 23, align: "right" as const },
                { label: "AMOUNT", x: 168, width: 27, align: "right" as const },
            ];
            let y = clientBottom + 22;
            const drawTableHeader = () => {
                pdf.setDrawColor(67, 56, 202);
                pdf.setLineWidth(0.5);
                pdf.line(margin, y + 2, right, y + 2);
                pdf.setFont("Jakarta", "semibold");
                pdf.setFontSize(6);
                pdf.setTextColor(67, 56, 202);
                for (const column of columns) {
                    pdf.text(column.label, column.align === "right" ? column.x + column.width : column.x, y, {
                        align: column.align,
                        charSpace: 0.5,
                    });
                }
                y += 9;
            };
            drawTableHeader();

            for (const item of invoice.items) {
                const nameLines = pdf.splitTextToSize(item.name || "-", columns[0].width);
                const descriptionLines = item.description
                    ? pdf.splitTextToSize(item.description, columns[1].width)
                    : [];
                const rowLines = Math.max(nameLines.length, descriptionLines.length);
                const rowPaddingTop = 4;
                const rowPaddingBottom = 8;
                const rowHeight = rowLines * 4 + rowPaddingTop + rowPaddingBottom;
                if (y + rowHeight > pageHeight - margin) {
                    pdf.addPage();
                    y = margin + 5;
                    drawTableHeader();
                }

                const textY = y + rowPaddingTop;
                pdf.setFont("Jakarta", "normal");
                pdf.setFontSize(8);
                pdf.setTextColor(45, 45, 45);
                pdf.text(nameLines, columns[0].x, textY);
                pdf.setFont("Jakarta", "normal");
                pdf.setTextColor(100, 100, 100);
                if (descriptionLines.length) {
                    pdf.text(descriptionLines, columns[1].x, textY);
                }
                pdf.setTextColor(45, 45, 45);
                const values = [
                    String(item.quantity),
                    item.discount > 0
                        ? item.discountType === "percentage" ? `${item.discount}%` : fmt(item.discount, invoice.currency)
                        : "-",
                    fmt(item.rate, invoice.currency),
                    fmt(itemAmount(item), invoice.currency),
                ];
                pdf.setFontSize(8);
                values.forEach((value, index) => {
                    const column = columns[index + 2];
                    pdf.text(value, column.x + column.width, textY, { align: "right" });
                });
                y += rowHeight;
                pdf.setDrawColor(230, 230, 230);
                pdf.line(margin, y - 2, right, y - 2);
            }

            const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
            const discounts = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate - itemAmount(item), 0);
            const total = invoice.items.reduce((sum, item) => sum + itemAmount(item), 0);
            const noteColumnWidth = (pageWidth - margin * 2 - 12) / 2;
            const noteLines = invoice.notes ? pdf.splitTextToSize(invoice.notes, noteColumnWidth) : [];
            const termsLines = invoice.terms ? pdf.splitTextToSize(invoice.terms, noteColumnWidth) : [];
            const hasFooter = noteLines.length > 0 || termsLines.length > 0;
            const footerHeight = hasFooter ? 10 + Math.max(noteLines.length, termsLines.length) * 4 : 0;
            const summaryHeight = discounts > 0 ? 31 : 25;
            const footerGap = hasFooter ? 8 : 0;

            if (y + summaryHeight + footerGap + footerHeight > pageHeight - margin) {
                pdf.addPage();
                y = margin + 5;
            }
            y += 5;
            pdf.setFont("Jakarta", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(80, 80, 80);
            pdf.text("Subtotal", 145, y);
            pdf.text(fmt(subtotal, invoice.currency), right, y, { align: "right" });
            y += 6;
            if (discounts > 0) {
                pdf.text("Discounts", 145, y);
                pdf.text(`-${fmt(discounts, invoice.currency)}`, right, y, { align: "right" });
                y += 6;
            }
            pdf.setDrawColor(26, 26, 26);
            pdf.line(145, y - 3, right, y - 3);
            pdf.setFont("Jakarta", "semibold");
            pdf.setFontSize(11);
            pdf.setTextColor(67, 56, 202);
            pdf.text("Total due", 145, y + 3);
            pdf.text(fmt(total, invoice.currency), right, y + 3, { align: "right" });
            y += 14;

            if (hasFooter) {
                const footerY = pageHeight - margin - footerHeight;
                const footerColumns = [
                    { label: "Notes", lines: noteLines, x: margin },
                    { label: "Terms", lines: termsLines, x: margin + noteColumnWidth + 12 },
                ];
                pdf.setDrawColor(235, 235, 235);
                pdf.line(margin, footerY - 5, right, footerY - 5);

                for (const column of footerColumns) {
                    if (!column.lines.length) continue;
                    pdf.setFont("Jakarta", "normal");
                    pdf.setFontSize(8);
                    pdf.setTextColor(130, 130, 130);
                    pdf.text(column.label.toUpperCase(), column.x, footerY);
                    pdf.setFont("Jakarta", "normal");
                    pdf.setFontSize(8);
                    pdf.setTextColor(80, 80, 80);
                    pdf.text(column.lines, column.x, footerY + 5);
                }
            }

            pdf.save(`${invoice.invoiceNumber}.pdf`);
            return;
        }

        if (format === "json") {
            const blob = new Blob([JSON.stringify(invoice, null, 2)], {
                type: "application/json"
            });

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${invoice.invoiceNumber}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    useEffect(() => {
        if (!id) resetInvoice();
    }, [])

    useEffect(() => {
        if (!id) return;

        getInvoice(id);
    }, [id])

    useEffect(() => {
        if (user) {
            getCompany();
        }
    }, [user])

    useEffect(() => {

        if (!userCompany) return;

        updateInvoice({
            companyName: userCompany.companyName,
            companyEmail: userCompany.companyEmail,
            companyAddress: userCompany.companyAddress,
            companyNumber: userCompany.companyPhoneNumber,
            notes: userCompany.default_notes,
            terms: userCompany.default_terms,
        })
    }, [userCompany])

    return (
        <div className="flex flex-col gap-6 p-5">
            {demo ? null : <div className="flex flex-row gap-5 items-center justify-end">
                <Button variant="outline" onClick={() => handleSaveDraft(id)}><Save></Save>Save as Draft</Button>
                <Button variant="outline" onClick={onPreview}><EyeIcon></EyeIcon>{showPreview ? "Close Preview" : "Preview PDF"}</Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}>Export As<ChevronDown></ChevronDown></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {/* <DropdownMenuLabel>Export as:</DropdownMenuLabel> */}
                        <DropdownMenuItem onClick={() => handleExport("pdf")}><NotepadTextDashed></NotepadTextDashed>PDF (Text)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport("image")}><NotepadTextDashed></NotepadTextDashed>PDF (Image)</DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleExport("json")}><FileJson></FileJson>JSON</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <hr></hr>
            </div>}

            {demo ? null : <LogoSection></LogoSection>}

            {/* <hr></hr> */}
            <MetaSection demo={demo}></MetaSection>
            <hr></hr>
            <div className="grid md:grid-cols-2 grid-cols-1 space-x-15">
                <SenderSection company={userCompany}></SenderSection>
                {/* {demo ? <DemoClientSection /> : <ClientSection></ClientSection>} */}
            </div>
            <hr></hr>
            <LineItemsSections></LineItemsSections>
            <hr></hr>
            {/* <FinancialsSection></FinancialsSection>
            <hr></hr> */}
            <NotesSection></NotesSection>
            {/* <hr></hr> */}
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-[#25343F] w-1/4">Save Invoice <ChevronDown /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><Send></Send>Save and Send</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            handleSaveDraft(id);
                        }}><NotepadTextDashed></NotepadTextDashed>Save as Draft</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu> */}
        </div>
    );
}

function LogoSection() {
    const fileRef = useRef<HTMLInputElement>(null);
    const logoUrl = useInvoiceStore((s) => s.invoice.logoUrl);
    const setLogo = useInvoiceStore((s) => s.setLogo);
    const getLogo = useInvoiceStore((s) => s.getLogo);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setLogo(ev.target?.result as string);
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        getLogo();
    }, [])

    return (
        <div>
            <p className="font-bold text-xl mb-5">Upload Logo</p>
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
    )
}

function SenderSection({ company }: { company: any }) {

    return (
        <div>
            <p className="text-[var(--primary)] text-xl font-bold">Your Details</p>
            <hr className="my-5"></hr>

            <div className="flex flex-col gap-3 py-5">
                <FieldGroup>
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <p className="text-[var(--primary)] font-bold text-lg">{company?.companyName}</p>
                        <span className="text-sm flex flex-col pt-5">
                            <p>Email: {company?.companyEmail}</p>
                            <p>Tel: {company?.companyPhoneNumber}</p>
                            <p>Address: {company?.companyAddress}</p>
                        </span>
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
    const clientNumber = useInvoiceStore((s) => s.invoice.clientNumber);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    return (
        <div>
            <p className="text-xl font-bold flex-1 text-[var(--primary)]">Client Details</p>
            <hr className="my-5"></hr>
            <div className="flex flex-col gap-3 py-5">
                <FieldGroup>

                    <Field>
                        <p className="text-[var(--primary)] font-bold text-lg">{clientName}</p>
                        <span className="text-sm flex flex-col pt-5">

                            <p>Email: {clientEmail}</p>
                            <p>Tel: {clientNumber}</p>
                            <p>Address: {clientAddress}</p>
                        </span>

                    </Field>
                </FieldGroup>
            </div>
        </div>
    );
}

function DemoClientSection() {
    const demoClients =
    {
        clientName: "Acme Company",
        clientEmail: "contact@acme.com",
        clientAddress: "123 Main St, Anytown, USA",
        clientNumber: "(555) 123-4567"
    }


    return (
        <div>
            <p className="text-xl font-bold flex-1 text-[var(--primary)]">Client Details</p>
            <hr className="my-5"></hr>
            <div className="flex flex-col gap-3 py-5">
                <FieldGroup>

                    <Field>
                        <p className="text-[var(--primary)] font-bold text-lg">{demoClients.clientName}</p>
                        <span className="text-sm flex flex-col pt-5">

                            <p>Email: {demoClients.clientEmail}</p>
                            <p>Tel: {demoClients.clientNumber}</p>
                            <p>Address: {demoClients.clientAddress}</p>
                        </span>

                    </Field>
                </FieldGroup>
            </div>
        </div>
    )
}

type PartnerOption = Pick<Partner, "id" | "name" | "email" | "phone" | "address">;

const DEMO_PARTNERS: PartnerOption[] = [
    {
        id: 1,
        name: "Acme Company",
        email: "contact@acme.com",
        phone: "(555) 123-4567",
        address: "123 Main St, Anytown, USA",
    },
    {
        id: 2,
        name: "Northstar Studio",
        email: "hello@northstar.example",
        phone: "(555) 987-6543",
        address: "42 Market Street, Anytown, USA",
    },
];

function MetaSection({ demo = false }: { demo?: boolean }) {
    const invoiceNumber = useInvoiceStore((s) => s.invoice.invoiceNumber);
    const issueDate = useInvoiceStore((s) => s.invoice.issueDate);
    const dueDate = useInvoiceStore((s) => s.invoice.dueDate);
    const invoice = useInvoiceStore((s) => s.invoice);

    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

    const [issueDateOpen, setIssueDateOpen] = useState(false);
    const [dueDateOpen, setDueDateOpen] = useState(false);


    const handleChange = (
        key: "invoiceNumber" | "issueDate" | "dueDate",
        value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const nextValue = typeof value === "string" ? value : value.currentTarget.value;
        updateInvoice({
            [key]: nextValue
        })
    }

    const [openPartner, setOpenPartner] = useState(false);

    const getPartners = usePartnerStore((s) => s.getPartners);
    const storedPartners = usePartnerStore((s) => s.partners);
    const partners: PartnerOption[] = demo ? DEMO_PARTNERS : storedPartners;
    const selectedPartner = partners.find((partner) => partner.id === invoice.partnerId) ?? null;

    useEffect(() => {
        if (!demo) void getPartners();
    }, [demo, getPartners])

    useEffect(() => {
        if (!selectedPartner) return;
        updateInvoice({
            clientName: selectedPartner.name,
            clientEmail: selectedPartner.email,
            clientAddress: selectedPartner.address,
            clientNumber: selectedPartner.phone,
        });

    }, [selectedPartner, updateInvoice])

    return (
        <div>
            <p className="text-xl font-bold text-[var(--primary)]">Invoice Details</p>
            <div className="flex flex-col gap-3 py-5">
                <Field className="w-1/2">
                    <FieldLabel>Invoice Number</FieldLabel>
                    <Input value={invoiceNumber ?? ""} onChange={(e) => handleChange("invoiceNumber", e)}></Input>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field>
                        <FieldLabel>Issue Date</FieldLabel>
                        <Popover onOpenChange={setIssueDateOpen} open={issueDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between">
                                    {/* {format(issueDate, "d MMMM yyyy")} */}
                                    {issueDate}
                                    <ChevronDownIcon></ChevronDownIcon>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
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
                                    {/* {format(dueDate, "d MMMM yyyy")} */}
                                    {dueDate}
                                    <ChevronDownIcon></ChevronDownIcon>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
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
                    <Field className="">
                        <FieldLabel>Choose Partner</FieldLabel>
                        <Popover open={openPartner} onOpenChange={setOpenPartner}>
                            <PopoverTrigger asChild>
                                <Button className="justify-between" variant="outline">{selectedPartner?.name ?? "Choose Partner"}<ChevronDown></ChevronDown></Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                                <Command>
                                    <CommandInput></CommandInput>
                                    <CommandList>

                                        {partners.map((partner) => (
                                            <CommandItem key={partner.id} keywords={[partner.name]} onSelect={(e) => {
                                                updateInvoice({ partnerId: partner.id });
                                                setOpenPartner(false);
                                            }}>
                                                <span className="flex flex-col">
                                                    <p>{partner.name}</p>
                                                    <p className="text-xs">{partner.phone}</p>
                                                    <p className="text-xs">{partner.email}</p>

                                                </span>
                                                <Check className={cn("ml-auto", selectedPartner?.name === partner.name ? "opacity-100" : "opacity-0")}></Check>
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Button className="bg-[var(--primary)]">Create new Partner</Button>
                    </Field>
                </div>
            </div>
        </div>
    );
}

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

function LineItemRow({ item }: { item: LineItem }) {
    const updateItem = useInvoiceStore((s) => s.updateItem);
    const removeItem = useInvoiceStore((s) => s.removeItem);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
    const invoiceCurrency = useInvoiceStore((s) => s.invoice.currency);

    const handleChangeCurrency = (code: string) => {
        updateInvoice({
            currency: code
        })
    }

    // const [currency, setCurrency] = useState("$");
    const [discountType, setDiscountType] = useState("%");

    const [openCurrency, setOpenCurrency] = useState(false);
    const [openDiscountType, setOpenDiscountType] = useState(false);

    const currencySymbol = CURRENCIES.find((c) => c.code === invoiceCurrency)?.value ?? "$";

    return (
        <TableRow>
            <TableCell className="py-1.5 px-1">
                <Input value={item.name} placeholder="Item Name" onChange={(e) => updateItem(item.id, { name: e.currentTarget.value })}></Input>
            </TableCell>
            <TableCell className="py-1.5 px-1">
                <Input value={item.description} placeholder="Item Description" onChange={(e) => updateItem(item.id, { description: e.currentTarget.value })}></Input>
            </TableCell>
            <TableCell className="py-1.5 px-1">
                <Input className="text-center w-full" placeholder="Item Quantity" value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.currentTarget.value) || 0 })}></Input>
            </TableCell>
            <TableCell className="py-1.5 px-1">
                <ButtonGroup className="flex items-center">
                    <Popover open={openDiscountType} onOpenChange={setOpenDiscountType}>
                        <PopoverTrigger className="min-w-fit shrink-0" asChild>
                            <Button variant={"outline"}>
                                {item.discountType === "percentage" ? "%" : currencySymbol} <ChevronDown></ChevronDown>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-full">
                            <Command>
                                <CommandGroup heading="Available Options">
                                    <CommandItem onSelect={() => updateItem(item.id, { discountType: "percentage", discount: 0, })} value={"percentage"}>% (percentage)</CommandItem>
                                    <CommandItem onSelect={() => updateItem(item.id, { discountType: "nominal", discount: 0 })} value={"nominal"}>Cash only</CommandItem>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Input className="text-right min-w-0 w-full" type="number" value={item.discount} onChange={(e) => {
                        const val = parseFloat(e.currentTarget.value) || 0;
                        if (item.discountType === "percentage") {
                            if (val >= 0 && val <= 100) {
                                updateItem(item.id, { discount: parseFloat(e.currentTarget.value) || 0 })
                            }
                        } else {
                            if (val >= 0) updateItem(item.id, { discount: parseFloat(e.currentTarget.value) || 0 })
                        }
                    }}></Input>
                </ButtonGroup>
            </TableCell>
            <TableCell className="py-1.5 px-1">
                <ButtonGroup className="flex items-center">
                    <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
                        <PopoverTrigger className="min-w-fit shrink-0" asChild>
                            <Button variant={"outline"}>
                                {currencySymbol} <ChevronDown></ChevronDown>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-full">
                            <Command>
                                <CommandGroup heading="Available Currencies">
                                    {CURRENCIES.map((c) => (
                                        <CommandItem key={c.value} value={c.value} onSelect={(e) => {
                                            handleChangeCurrency(c.code);
                                            setOpenCurrency(false);
                                        }}>
                                            {c.value + "  " + c.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Input className="text-right" value={item.rate} onChange={(e) => updateItem(item.id, { rate: parseFloat(e.currentTarget.value) || 0 })}></Input>
                </ButtonGroup>
            </TableCell>
            <TableCell className="py-1.5 px-1">

                <Button variant="destructive" onClick={() => removeItem(item.id)}>
                    <Trash2></Trash2>
                </Button>
            </TableCell>
        </TableRow>
    );
}

function LineItemsSections() {
    const items = useInvoiceStore((s) => s.invoice.items);
    const addItem = useInvoiceStore((s) => s.addItem);

    return (
        <div>
            <p className="text-xl font-bold text-[var(--primary)]">Items</p>
            {/* <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[0.75fr_1.25fr_3.5rem_8rem_8rem_2.5rem] gap-2 px-1 mt-5">
                    {["Name", "Description", "Quantity", "Discount", "Rate", ""].map((h) => (
                        <span key={h} className="text-[10px] uppercase tracking-widest font-medium">{h}</span>
                    ))}
                </div>
                {items.map((item) => (
                    <LineItemRow key={item.id} item={item}></LineItemRow>
                ))}
                <Button variant={"outline"} onClick={addItem} className="gap-2 border-dashed mt-1">
                    <Plus></Plus> Add Item
                </Button>
            </div> */}
            <Table className="[&_th]:bg-[var(--primary)] [&_th]:text-white mt-5">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center w-24">Qty</TableHead>
                        <TableHead className="text-right w-48">Discount</TableHead>
                        <TableHead className="text-right w-48">Rate</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <LineItemRow key={item.id} item={item}></LineItemRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant={"default"} onClick={addItem} className="gap-2 border-dashed mt-1">
                <Plus></Plus> Add Item
            </Button>
        </div>
    )
}

// function FinancialsSection() {
//     const taxRate = useInvoiceStore((s) => s.invoice.taxRate);
//     const discountRate = useInvoiceStore((s) => s.invoice.discountRate);
//     const updateInvoice = useInvoiceStore((s) => s.updateInvoice);

//     const handleChange = (key: keyof InvoiceData, e: any) => {
//         updateInvoice({
//             [key]: parseFloat(e.currentTarget.value)
//         })
//     }

//     return (
//         <div>
//             <p className="text-xl font-bold">Tax & Discount</p>
//             <div className="grid grid-cols-2 gap-3">
//                 <Field>
//                     <FieldLabel>Discount (%)</FieldLabel>
//                     <Input type="number" value={discountRate} onChange={(e) => {
//                         const num = Number(e.currentTarget.value.replace(/\D/g, ""));
//                         if (num >= 0) {
//                             handleChange('discountRate', num)
//                         }
//                     }}></Input>
//                 </Field>
//                 <Field>
//                     <FieldLabel>Tax / VAT (%)</FieldLabel>
//                     <Input type="number" value={taxRate} onChange={(e) => {
//                         const num = Number(e.currentTarget.value.replace(/\D/g, ""));
//                         if (num >= 0) {
//                             handleChange('taxRate', num)
//                         }
//                     }}></Input>
//                 </Field>
//             </div>
//         </div>
//     );
// }

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