"use client"

import InvoiceEditorV2 from "@/app/components/invoice_editor_v2";
import InvoicePreview from "@/app/components/invoice_preview";
import { useRef, useState } from "react";

interface Props {
    user: any,
    id?: string,
}

export default function InvoiceLayout({ user, id }: Props ) {

    const previewRef = useRef<HTMLDivElement>(null);
    const [showPreview, setShowPreview] = useState(false);

    console.log(showPreview);

    return (
        <div className="flex flex-row gap-5 flex-1">
            <div className="border flex-1 rounded-xl bg-white mb-5 shadow-xl overflow-y-auto">
                <InvoiceEditorV2 
                    user={user} 
                    previewRef={previewRef}
                    showPreview={showPreview}
                    onPreview={() => setShowPreview(prev => !prev)}
                >

                </InvoiceEditorV2>
            </div>
            {/* <InvoicePreview ref={previewRef}></InvoicePreview> */}
            {/* <div className="fixed -left-[9999px] -top-[9999px]"> */}
            <div style={{display: showPreview ? "block" : "none"}} className="border shadow-xl rounded-xl bg-white mb-5 p-5 sticky top-0 h-screen overflow-y-auto">
                {/* <p className="mb-5 font-bold text-lg">Live Preview</p> */}
                <InvoicePreview ref={previewRef}></InvoicePreview>
            </div>
        </div>
    );
}