import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NavbarLanding() {
    return (
        <nav className="fixed top-0 left-0 right-0 border-b-1 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <p className="font-bold text-lg text-[var(--primary)]">Invoicer</p>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-sm transition-colors hover:text-[var(--green)]">Features</Link>
                        <Link href="#how" className="text-sm transition-colors hover:text-[var(--green)]">How it works</Link>
                        <Link href="#how" className="text-sm transition-colors hover:text-[var(--green)]">FAQs</Link>
                        <Link href="/login"><Button className="text-sm font-bold">Get Started</Button></Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}