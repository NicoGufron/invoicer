import { Button } from "@/components/ui/button";
import InvoicePreviewHero from "./invoice_preview_hero";
import { useInvoiceStore } from "../stores/invoice.store";
import Link from "next/link";

export default function HeroSection() {

    return (
        <section className="min-h-screen m-auto justify-between flex flex-col gap-5">
            <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-white">

                <div className="flex flex-col items-center gap-5">
                    <div className="rounded-xl bg-[var(--primary)] p-2.5 font-bold">
                        <p className="uppercase text-xs text-white tracking-wide">Built for freelancers & small teams</p>
                    </div>
                    <p className="text-5xl font-bold text-center">Create Professional Invoices in Seconds, <span className="text-[var(--primary)]"><br></br>Get Paid Faster</span></p>
                    <p className="text-center w-1/2">The intuitive invoicing tool built for freelancers, agencies, and growing businesses. Real-time preview, instant PDF & JSON export, smart tax & discount calculations, and client partner management.</p>
                    <div className="flex flex-row items-center gap-5">
                        <Link href="/login"><Button className="p-5">Start for free <span>→</span></Button></Link>
                        <Link href="#features"><Button className="p-5" variant={"outline"}>See features</Button></Link>
                    </div>
                </div>
                {/* <div className="border rounded-xl">
                    <InvoicePreviewHero></InvoicePreviewHero>
                </div> */}
            </div>
            <div className="bg-[var(--surface)]">
                <div className="grid grid-cols-3 bg-[#F2EFFF] p-5 gap-5">
                    <div className="flex flex-col items-center py-5 bg-white rounded-xl">
                        <p className="text-3xl font-bold text-[var(--primary)]">30<span className="text-[var(--primary)]">s</span></p>
                        <p className="text-sm pt-2.5">Average creation time</p>
                    </div>
                    <div className="flex flex-col items-center py-5 bg-white rounded-xl">
                        <p className="text-3xl font-bold"><span className="text-[var(--primary)]">∞</span></p>
                        <p className="text-sm pt-2.5">Invoice count - no cap, ever</p>
                    </div>

                    <div className="flex flex-col items-center py-5 bg-white rounded-xl">
                        <p className="text-3xl font-bold text-[var(--primary)]">3</p>
                        <p className="text-sm pt-2.5">Export formats: PDF, JSON, email</p>
                    </div>
                </div>
            </div>
        </section>
    )
}