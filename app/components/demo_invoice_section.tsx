"use client";

import { useState } from "react";
import InvoiceEditorV2 from "./invoice_editor_v2";
import InvoicePreviewHero1 from "./invoice_preview_hero_1";

export default function DemoInvoiceSection() {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <section className="pt-[148px] px-[5%] pb-[100px] m-auto bg-[#F2EFFF]">
            <div className="uppercase tracking-wide text-sm font-bold text-[var(--primary)] pb-5">Interactive Sandbox</div>
            <div className="text-3xl font-bold">Try the Live Invoice Generator.</div>
            <div className="text-md max-w-[500px] pt-5">Update values on the left editor and watch the document compute totals in real time.</div>
            <div className="grid grid-cols-2 items-start gap-5 pt-5">
                <div className="bg-[#FFFFFF] rounded-xl shadow-lg">
                    <InvoiceEditorV2 user={undefined} demo showPreview={showPreview} onPreview={() => setShowPreview(prev => !prev)}></InvoiceEditorV2>
                </div>
                <div className="sticky top-5 max-h-[calc(100vh-2.5rem)] overflow-y-auto shadow-lg">

                <InvoicePreviewHero1></InvoicePreviewHero1>
                </div>
            </div>
        </section>
    );
}