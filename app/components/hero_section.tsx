import { Button } from "@/components/ui/button";
import InvoicePreviewHero from "./invoice_preview_hero";
import { useInvoiceStore } from "../stores/invoice.store";
import Link from "next/link";

export default function HeroSection() {    
    
    return (
        <section className="hero-section">
            <div className="grid grid-cols-2 items-center justify-center gap-5">

                <div className="flex flex-col items-start gap-5">
                    <div className="rounded-xl bg-[var(--green-tint)] p-2.5 font-bold">
                        <p className="uppercase text-xs text-[var(--green)] tracking-wide">Built for freelancers & small teams</p>
                    </div>
                    <p className="text-5xl text-[var(--primary)] font-bold">Invoicing that <span className="text-[var(--green)]">actually</span> works.</p>
                    <p className="text-md">Create, customize, and send professional invoices in minutes. With live preview, PDF export, partner management, and multi-currency support — everything in one place.</p>
                    <div className="flex flex-col gap-5">
                        <Link href="/login"><Button className="p-5">Start for free <span>→</span></Button></Link>
                        <Link href="/"><Button className="p-5" variant={"outline"}>See features</Button></Link>
                    </div>
                </div>
                <div className="border rounded-xl">
                    <InvoicePreviewHero></InvoicePreviewHero>
                </div>
            </div>
        </section>
    )
}