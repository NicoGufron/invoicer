"use client";

import { ArrowRight, Menu, MoveRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isOpen, setOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);

        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setOpen(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen])

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <p className="text-2xl font-bold text-indigo-500">Invoicer</p>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button className="text-gray-700 hover:text-indigo-500 transition-colors font-medium" onClick={() => scrollToSection('hero')}>Beranda</button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className="text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Fitur
                        </button>
                        <button
                            onClick={() => scrollToSection('subscription')}
                            className="text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Paket
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Kontak
                        </button>
                        <Link
                            href="/login"
                            className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-600 italic transition-colors"
                        >
                            <span className="flex flex-row gap-2 items-center">

                                Sign Up <MoveRight className="size-6"></MoveRight>
                            </span>
                        </Link>
                    </div>

                    <button onClick={() => setOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {isOpen ? (<X className="text-2xl text-gray-700"></X>) : (<Menu className="text-2xl text-gray-700"></Menu>)}
                    </button>


                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg z-40 flex flex-col animate-in slide-in-from-top-4 duration-300">
                    <div className="container mx-auto px0-4 flex flex-col items-center justify-center flex-1 py-10 space-y-8">
                        <button
                            onClick={() => scrollToSection('hero')}
                            className="text-lg text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className="text-lg text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Fitur
                        </button>
                        <button
                            onClick={() => scrollToSection('subscription')}
                            className="text-lg text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Paket
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="text-lg text-gray-700 hover:text-indigo-500 transition-colors font-medium"
                        >
                            Kontak
                        </button>
                        <Link
                            href="/login"
                            className="bg-[#25343F] text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors italic text-lg"
                        >
                            Masuk
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}