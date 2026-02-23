import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen p-6">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="uppercase">Welcome to</p>
        <h1 className="text-7xl font-bold">INVOICER</h1>
        <p>Where you build invoices easily!</p>
        <span>
          <Link href="/login">
            <Button variant="outline">Get Started</Button>
          </Link>
        </span>
      </div>
    </div>
  );
}
