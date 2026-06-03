"use client";

import { fmt, formatDate } from "@/lib/utils";
import { LineItem, useInvoiceStore } from "../stores/invoice.store";
import { forwardRef, useEffect } from "react";

const InvoicePreviewHero1 = forwardRef<HTMLDivElement>((_, ref) => {
    const invoice = useInvoiceStore((s) => s.invoice);
    const updateInvoice = useInvoiceStore((s) => s.updateInvoice);
    // const { subtotal, discountAmt, taxAmt, total } = useInvoiceTotals();

    const { items, discountRate, currency } = invoice;
    // const discountAmt = subtotal * (discountRate / 100);
    // const taxableAmt = subtotal - discountAmt;

    const itemAmount = (item: LineItem) => {
        const gross = item.quantity * item.rate;
        if (item.discount === 0) return gross;

        const discountAmt = item.discountType === "percentage" ? gross * (item.discount / 100) : item.discount
        return gross - discountAmt;
    }

    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const totalDiscounts = items.reduce((sum, i) => {
        const gross = i.quantity * i.rate;
        if (i.discount === 0) return sum;
        const discountAmt = i.discountType === "percentage" ? gross * (i.discount / 100) : i.discount

        return sum + discountAmt;
    }, 0)

    const afterDiscount = subtotal - totalDiscounts;
    // const taxAmt = afterDiscount * (taxRate / 100);
    const total = afterDiscount;

    useEffect(() => {
        updateInvoice({
            ['totalAmount'] : total
        })
    }, [total]);

    return (
        <div ref={ref} className="bg-white w-[1/2] h-screen flex flex-col text-[#1a1a1a] overflow-hidden">
            {/* Minimal top rule — single pixel, neutral */}
            <div className="h-px w-full bg-[#e0e0e0] flex-shrink-0" />

            <div className="flex flex-col flex-1 px-14 py-12 overflow-y-auto">

                {/* Header: company left, invoice number right */}
                <div className="flex justify-between items-start mb-14">
                    <div>
                        {invoice.logoUrl && (
                            <img src={invoice.logoUrl} alt="logo" className="h-10 w-auto object-contain mb-4" />
                        )}
                        <div className="text-xl font-semibold tracking-tight leading-none text-[#111]">
                            {invoice.companyName || "Your Company"}
                        </div>
                        <div className="text-[11px] text-[#999] mt-2 whitespace-pre-wrap leading-relaxed">
                            {invoice.companyAddress}
                        </div>
                        {invoice.companyNumber && (
                            <div className="text-[11px] text-[#999] mt-0.5">Tel: {invoice.companyNumber}</div>
                        )}
                        {invoice.companyEmail && (
                            <div className="text-[11px] text-[#999]">{invoice.companyEmail}</div>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="text-[9px] uppercase tracking-[0.18em] text-[#bbb] mb-2">Invoice</div>
                        <div className="text-2xl font-mono font-medium tracking-tight text-[#111]">
                            {invoice.invoiceNumber || "INV-001"}
                        </div>
                        <div className="mt-4 space-y-1">
                            <div className="text-[11px] text-[#999]">
                                <span className="text-[#ccc] mr-1.5">Issued</span>
                                {formatDate(invoice.issueDate)}
                            </div>
                            <div className="text-[11px]">
                                <span className="text-[#ccc] mr-1.5">Due</span>
                                <span className="font-medium text-[#444]">{formatDate(invoice.dueDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-[#bbb] mb-3">
                        Bill To
                    </div>
                    <div className="font-semibold text-sm text-[#111] mb-0.5">
                        {invoice.clientName || "—"}
                    </div>
                    <div className="text-[11px] text-[#777] whitespace-pre-wrap leading-relaxed">
                        {invoice.clientAddress}
                    </div>
                    {invoice.clientNumber && (
                        <div className="text-[11px] text-[#777] mt-0.5">Tel: {invoice.clientNumber}</div>
                    )}
                    {invoice.clientEmail && (
                        <div className="text-[11px] text-[#777]">{invoice.clientEmail}</div>
                    )}
                </div>

                {/* Line items table */}
                <table className="w-full mb-8 text-sm">
                    <thead>
                        <tr className="border-b border-[#e8e8e8]">
                            {["Name", "Description", "Qty", "Discount", "Rate", "Amount"].map((h, i) => (
                                <th
                                    key={h}
                                    className={`pb-2.5 text-[9px] uppercase tracking-[0.15em] text-[#bbb] font-medium ${
                                        i <= 1 ? "text-left" : "text-right"
                                    } ${i === 0 ? "w-36" : i === 1 ? "w-36" : i === 2 ? "w-12" : i >= 3 ? "w-24" : ""}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-xs text-[#ddd]">
                                    No items yet
                                </td>
                            </tr>
                        ) : (
                            invoice.items.map((item) => (
                                <tr key={item.id} className="border-b border-[#f5f5f5] group">
                                    <td className="py-3 pr-4 text-xs text-[#222] font-medium">{item.name || "—"}</td>
                                    <td className="py-3 pr-4 text-xs text-[#777]">{item.description || "—"}</td>
                                    <td className="py-3 text-center text-xs text-[#777]">{item.quantity}</td>
                                    <td className="py-3 text-center text-xs text-[#777]">
                                        {item.discount > 0
                                            ? item.discountType === "percentage"
                                                ? `${item.discount}%`
                                                : fmt(item.discount, currency)
                                            : <span className="text-[#ddd]">—</span>}
                                    </td>
                                    <td className="py-3 text-right text-xs text-[#777]">{fmt(item.rate, currency)}</td>
                                    <td className="py-3 text-right text-xs font-medium text-[#111]">
                                        {item.discount > 0 && (
                                            <span className="line-through text-[#ccc] mr-1.5 font-normal">
                                                {fmt(item.quantity * item.rate, currency)}
                                            </span>
                                        )}
                                        {fmt(itemAmount(item), currency)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-52 text-xs">
                        <div className="flex justify-between py-1.5 text-[#888]">
                            <span>Subtotal</span>
                            <span className="text-[#444] font-medium">{fmt(subtotal, currency)}</span>
                        </div>
                        {totalDiscounts > 0 && (
                            <div className="flex justify-between py-1.5 text-[#888]">
                                <span>Discounts</span>
                                <span className="text-[#444] font-medium">−{fmt(totalDiscounts, currency)}</span>
                            </div>
                        )}
                        {/* {invoice.discountRate > 0 && (
                            <div className="flex justify-between py-1.5 text-[#888]">
                                <span>Discount ({invoice.discountRate}%)</span>
                                <span className="text-green-600">−{fmt(discountAmt, currency)}</span>
                            </div>
                        )}
                        {invoice.taxRate > 0 && (
                            <div className="flex justify-between py-1.5 text-[#888]">
                                <span>Tax ({invoice.taxRate}%)</span>
                                <span>{fmt(taxAmt, currency)}</span>
                            </div>
                        )} */}
                        <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-[#222]">
                            <span className="text-xs font-semibold text-[#111]">Total Due</span>
                            <span className="text-lg font-semibold tracking-tight text-[#111]">{fmt(total, currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                {/* {(invoice.notes || invoice.terms) && ( */}
                <div className="mt-auto pt-6 border-t border-[#ebebeb] grid grid-cols-2 gap-8">
                    {/* {invoice.notes && ( */}
                    <div>
                        <div className="text-[9px] uppercase tracking-[0.15em] text-[#bbb] mb-2">Notes</div>
                        <p className="text-[10px] text-[#888] leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
                    </div>
                    {/* )} */}
                    {/* {invoice.terms && ( */}
                    <div>
                        <div className="text-[9px] uppercase tracking-[0.15em] text-[#bbb] mb-2">Terms</div>
                        <p className="text-[10px] text-[#888] leading-relaxed whitespace-pre-wrap">{invoice.terms}</p>
                    </div>
                    {/* )} */}
                </div>
                {/* )} */}

            </div>

            {/* Minimal bottom rule */}
            <div className="h-px w-full bg-[#e0e0e0] flex-shrink-0" />
        </div>
    )
})

InvoicePreviewHero1.displayName = "InvoicePreviewHero";

export default InvoicePreviewHero1;