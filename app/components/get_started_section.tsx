import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function GetStartedSection() {
    return (
        <section className="flex flex-col items-center justify-center pt-[148px] w-full px-4 pb-[100px] gap-5 bg-white">
            {/* <div className="uppercase tracking-wide text-sm font-bold text-[var(--green)] pb-5">Get started</div> */}
            <div className="bg-[var(--primary)] rounded-3xl flex flex-col items-center w-full max-w-6xl p-10 md:p-16">

                <div className="text-4xl text-white font-bold text-center mb-[15px]">Start sending invoices<br></br>today.</div>
                <div className="text-white">No credit card required. No complexity. Just clean, fast invoicing.</div>
                <div className="flex flex-row mt-10 gap-5">
                    <Link href="/login"><Button className="bg-white text-[var(--primary)] px-6 py-3 text-sm font-bold hover:bg-white/90">Create Invoice Now<Zap></Zap></Button></Link>
                    <Link href="#features"><Button className="border border-input px-6 py-3 text-white text-sm font-bold hover:bg-[var(--primary)]/50">View Features</Button></Link>
                </div>
                <div className="text-white flex flex-row gap-5 pt-10">
                    <p>Instant PDF Export</p>
                    <p>&bull;</p>
                    <p>Clean JSON Output</p>
                    <p>&bull;</p>
                    <p>No Credit Card Setup</p>


                </div>
            </div>
        </section>
    );
}