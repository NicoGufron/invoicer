"use client";

import { fmt, formatDate } from "@/lib/utils";
import { InvoiceData, LineItem, useInvoiceStore } from "../stores/invoice.store";
import { forwardRef, useEffect, useState } from "react";

const InvoicePreviewHero = forwardRef<HTMLDivElement>((_, ref) => {

    const demoInvoiceData: InvoiceData = {
        userId: "",
        companyName: "Acme Corporation",
        companyAddress: "123 Main St, City, State 00000",
        companyEmail: "hello@yourcompany.com",
        companyNumber: "",
        partnerId: 0,
        totalAmount: 0,
        clientName: "Wile E.Coyote",
        clientAddress: "456 Client Ave, City, State 00000",
        clientEmail: "client@example.com",
        clientNumber: "",
        invoiceNumber: "INV/" + "2026" + "/001",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        logoUrl: null,
        items: [
            {
                id: "1",
                name: "Web Development",
                description: "Frontend implementation and integration",
                discountType: "nominal",
                quantity: 1,
                discount: 0,
                rate: 500
            },
            {
                id: "2",
                name: "UI/UX Design",
                description: "Wireframes and high-fidelity mockups",
                discountType: "nominal",
                quantity: 2,
                discount: 20,
                rate: 150
            },
            {
                id: "3",
                name: "Consultation",
                description: "Technical Planning Session",
                discountType: "percentage",
                quantity: 1,
                discount: 10,
                rate: 100
            }
        ],
        // taxRate: 0,
        discountRate: 0,
        notes: "Thank you for your business. Please remit payment within the due date to avoid any late fees.",
        terms: "Payment is due within 30 days of the invoice date. Late payments may be subject to a 1.5% monthly interest charge.",
        currency: "USD",
    }

    const [invoice, setInvoice] = useState<InvoiceData>(demoInvoiceData);

    const { items, currency } = invoice;

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
    const total = afterDiscount;

    return (
        <div ref={ref} className="h-screen flex flex-col text-[#1a1a1a]">
            <div className="h-1.5 w-full bg-primary flex-shrink-0">
                <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            {invoice.logoUrl && (
                                <img src={invoice.logoUrl} alt="logo" className="h-15 w-auto object-contain mb-3"></img>
                            )}
                            <div className="text-2xl font-bold tracking-tight leading-none">
                                {invoice.companyName || "Your Company"}
                            </div>
                            <div className="text-xs text-[#888] mt-1 whitespace-pre-wrap leading-relaxed">
                                {invoice.companyAddress}
                            </div>
                            {invoice.companyNumber && (
                                <div className="text-xs text-[#888]">Tel: {invoice.companyNumber}</div>
                            )}
                            {invoice.companyEmail && (
                                <div className="text-xs text-[#888]">Email: {invoice.companyEmail}</div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-[0.15em] text-[#aaa] mb-1">Invoice</div>
                            <div className="text-2xl font-mono font-semibold tracking-tight text-primary">
                                {invoice.invoiceNumber || "INV-001"}
                            </div>
                            <div className="mt-3 text-xs text-[#888] space-y-1 leading-relaxed">
                                <div>
                                    <span className="text-[#bbb] mr-1">Issued</span>
                                    {formatDate(invoice.issueDate)}
                                </div>
                                <div>
                                    <span className="text-[#bbb] mr-1">Due</span>
                                    <span className="font-medium text-[#333]">
                                        {formatDate(invoice.dueDate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mb-10">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-[#aaa] mb-2 pb-2 border-b border-[#ebebeb]">
                            Bill To
                        </div>
                        <div className="font-semibold text-base mb-0.5">{invoice.clientName || "—"}</div>
                        <div className="text-xs text-[#666] whitespace-pre-wrap leading-relaxed">{invoice.clientAddress}</div>
                        {invoice.clientNumber && (
                            <div className="text-xs text-[#666]">Tel: {invoice.clientNumber}</div>
                        )}
                        {invoice.clientEmail && (
                            <div className="text-xs text-[#666]">Email: {invoice.clientEmail}</div>
                        )}
                    </div>
                    <table className="w-full mb-6 text-sm">
                        <thead>
                            <tr className="border-b-2 border-primary">
                                {["Name", "Description", "Quantity", "Discount", "Rate", "Amount"].map((h, i) => (
                                    <th
                                        key={h}
                                        className={`pb-2 text-[10px] uppercase tracking-[0.13em] text-primary font-semibold ${i <= 1 ? "text-left" : "text-right"
                                            } ${i === 0 ? "w-36" : i === 1 ? "w-36" : i === 2 ? "w-16" : i >= 3 ? "w-24" : ""}`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-xs text-[#ccc]">
                                        No items yet
                                    </td>
                                </tr>
                            ) : (
                                invoice.items.map((item) => (
                                    <tr key={item.id} className="border-b text-xs border-[#f0f0f0]">
                                        <td className="py-3 pr-4 text-[#333]">{item.name || "—"}</td>
                                        <td className="py-3 pr-4 text-[#333]">{item.description || "—"}</td>
                                        <td className="py-3 text-center text-[#555]">{item.quantity}</td>
                                        <td className="py-3 text-center text-[#555]">
                                            {item.discount > 0 ? item.discountType === "percentage" ? `${item.discount}%` : fmt(item.discount, currency) : "--"}
                                        </td>
                                        <td className="py-3 text-right text-[#555]">{fmt(item.rate, currency)}</td>
                                        <td className="py-3 text-right font-medium">
                                            {item.discount > 0 && (
                                                <span className="line-through text-[#bbb] mr-1.5 font-normal">
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

                    <div className="flex justify-end mb-10">
                        <div className="w-56 text-sm">
                            <div className="flex justify-between py-1.5 text-[#666]">
                                <span>Subtotal</span>
                                <span className="font-bold">{fmt(subtotal, currency)}</span>
                            </div>
                            {totalDiscounts > 0 && (
                                <div className="flex justify-between py-1.5 text-[#666]">
                                    <span>Discounts</span>
                                    <span className="font-bold">-{fmt(totalDiscounts, currency)}</span>
                                </div>
                            )}
                            {/* {invoice.discountRate > 0 && (
                                <div className="flex justify-between py-1.5 text-[#666]">
                                    <span>Discount ({invoice.discountRate}%)</span>
                                    <span className="text-green-600">−{fmt(discountAmt, currency)}</span>
                                </div>
                            )}
                            {invoice.taxRate > 0 && (
                                <div className="flex justify-between py-1.5 text-[#666]">
                                    <span>Tax ({invoice.taxRate}%)</span>
                                    <span>{fmt(taxAmt, currency)}</span>
                                </div>
                            )} */}
                            <div className="flex justify-between py-3 mt-1 border-t-2 border-[#1a1a1a] font-semibold text-base">
                                <span>Total Due</span>
                                <span className="text-primary">{fmt(total, currency)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="py-6 border-t border-[#ebebeb] grid grid-cols-2 gap-8 text-xs">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.13em] text-[#aaa] mb-1.5">Notes</div>
                            <p className="text-[10px] text-[#666] leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.13em] text-[#aaa] mb-1.5">Terms</div>
                            <p className="text-[10px] text-[#666] leading-relaxed whitespace-pre-wrap">{invoice.terms}</p>
                        </div>
                        {/* )} */}
                    </div>
                    {/* )} */}
                </div>
                {/* <div className="h-1.5 w-full bg-primary flex-shrink-0" /> */}
            </div>
        </div>
    )
})

InvoicePreviewHero.displayName = "InvoicePreviewHero";

export default InvoicePreviewHero;