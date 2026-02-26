"use client";

import { fmt, formatDate } from "@/lib/utils";
import { useInvoiceStore } from "../stores/invoice.store";

export default function InvoicePreview() {
    const invoice = useInvoiceStore((s) => s.invoice);
    // const { subtotal, discountAmt, taxAmt, total } = useInvoiceTotals();

    const { items, taxRate, discountRate } = invoice;
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const discountAmt = subtotal * (discountRate / 100);
    const taxableAmt = subtotal - discountAmt;
    const taxAmt = taxableAmt * (taxRate / 100);
    const total = taxableAmt + taxAmt;

    return (
        <div className="bg-white w-[680px] min-h-[900px] flex flex-col text-[#1a1a1a] overflow-hidden">
            <div className="h-1.5 w-full bg-primary flex-shrink-0">
                <div className="flex flex-col flex-1 p-14">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            {invoice.logoUrl && (
                                <img src={invoice.logoUrl} alt="logo" className="h-50 object-contain mb-3"></img>
                            )}
                            <div className="text-2xl font-bold tracking-tight leading-none">
                                {invoice.companyName || "Your Company"}
                            </div>
                            <div className="text-xs text-[#888] mt-1 whitespace-pre-wrap leading-relaxed">
                                {invoice.companyAddress}
                            </div>
                            {invoice.companyEmail && (
                                <div className="text-xs text-[#888]">{invoice.companyEmail}</div>
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
                        {invoice.clientEmail && (
                            <div className="text-xs text-[#666]">{invoice.clientEmail}</div>
                        )}
                    </div>
                    <table className="w-full mb-6 text-sm">
                        <thead>
                            <tr className="border-b-2 border-primary">
                                {["Name", "Description", "Qty", "Rate", "Amount"].map((h, i) => (
                                    <th
                                        key={h}
                                        className={`pb-2 text-[10px] uppercase tracking-[0.13em] text-primary font-semibold ${i <= 1 ? "text-left" : "text-right"
                                            } ${i === 0 ? "w-32" : i === 1 ? "" : i === 2 ? "w-16" : i >= 3 ? "w-24" : ""}`}
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
                                    <tr key={item.id} className="border-b border-[#f0f0f0]">
                                        <td className="py-3 pr-4 text-[#333]">{item.name || "—"}</td>
                                        <td className="py-3 pr-4 text-[#333]">{item.description || "—"}</td>
                                        <td className="py-3 text-right text-[#555]">{item.quantity}</td>
                                        <td className="py-3 text-right text-[#555]">{fmt(item.rate)}</td>
                                        <td className="py-3 text-right font-medium">{fmt(item.quantity * item.rate)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="flex justify-end mb-10">
                        <div className="w-56 text-sm">
                            <div className="flex justify-between py-1.5 text-[#666]">
                                <span>Subtotal</span>
                                <span>{fmt(subtotal)}</span>
                            </div>
                            {invoice.discountRate > 0 && (
                                <div className="flex justify-between py-1.5 text-[#666]">
                                    <span>Discount ({invoice.discountRate}%)</span>
                                    <span className="text-green-600">−{fmt(discountAmt)}</span>
                                </div>
                            )}
                            {invoice.taxRate > 0 && (
                                <div className="flex justify-between py-1.5 text-[#666]">
                                    <span>Tax ({invoice.taxRate}%)</span>
                                    <span>{fmt(taxAmt)}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 mt-1 border-t-2 border-[#1a1a1a] font-semibold text-base">
                                <span>Total Due</span>
                                <span className="text-primary">{fmt(total)}</span>
                            </div>
                        </div>
                    </div>
                    {(invoice.notes || invoice.terms) && (
                        <div className="mt-auto pt-6 border-t border-[#ebebeb] grid grid-cols-2 gap-8 text-xs">
                            {/* {invoice.notes && ( */}
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.13em] text-[#aaa] mb-1.5">Notes</div>
                                <p className="text-[#666] leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
                            </div>
                            {/* )} */}
                            {/* {invoice.terms && ( */}
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.13em] text-[#aaa] mb-1.5">Terms</div>
                                <p className="text-[#666] leading-relaxed whitespace-pre-wrap">{invoice.terms}</p>
                            </div>
                            {/* )} */}
                        </div>
                    )}
                </div>
                <div className="h-1 w-full bg-primary/20 flex-shrink-0" />
            </div>
        </div>
    )
}