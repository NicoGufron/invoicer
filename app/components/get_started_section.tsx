import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GetStartedSection() {
    return(
        <section className="flex flex-col items-center pt-[148px] pb-[100px] gap-5">
            <div className="uppercase tracking-wide text-sm font-bold text-[var(--green)] pb-5">Get started</div>
            <div className="text-3xl text-[var(--primary)] font-bold text-center mb-[15px]">Start sending invoices<br></br>today.</div>
            <div>No credit card required. No complexity. Just clean, fast invoicing.</div>
            <Link href="/login"><Button className="text-sm font-bold">Get started</Button></Link>
        </section>
    );
}