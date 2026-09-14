import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NavbarLanding() {
    return (
        <nav className="fixed z-100 top-0 left-0 right-0 border-b-1 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <p className="font-bold text-lg text-[var(--primary)]">Invoicer</p>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 font-bold">
                        <Link href="#features" className="text-sm transition-colors hover:text-[var(--primary)]">Features</Link>
                        <Link href="#demo" className="text-sm transition-colors hover:text-[var(--primary)]">Interactive Generator</Link>
                        {/* <Link href="#how" className="text-sm transition-colors hover:text-[var(--primary)]">Plans</Link> */}
                        <Link href="#faq" className="text-sm transition-colors hover:text-[var(--primary)]">FAQ</Link>

                    </div>
                    <div className="md:flex items-center space-x-8">
                        <Link href="/login"><Button className="text-sm font-bold">Start Free</Button></Link>

                    </div>
                </div>
            </div>
        </nav>
    );
}