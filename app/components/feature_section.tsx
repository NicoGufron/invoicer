import { Eye } from "lucide-react";
import FeatureCard from "./feature-card";

export default function FeatureSection() {

    const features = [
        {
            title: "Live Preview",
            subtitle: "See your invoice update in real time as you type. No save-and-refresh loops — what you see is what you send.",
            icon: <Eye></Eye>,
            dark: true,
        },
        {
            title: "PDF & JSON export",
            subtitle: "Export any invoice as a polished PDF for clients, or as JSON for integrations, archives, and your own tooling.",
            icon: "📄",
            dark: false,
        },
        {
            title: "Send by email (in progress)",
            subtitle: "Deliver invoices directly from Invoicer. No copy-paste, no third-party email setup — just one click to send.",
            icon: "✉️",
            dark: true,
        },
        {
            title: "Partner management",
            subtitle: "Save client details once, reuse them forever. Invoicer auto-fills partner info on every new invoice you create.",
            icon: "🤝",
            dark: false,
        },
        {
            title: "Discount & taxes",
            subtitle: "Apply percentage or fixed discounts per line item or invoice-wide. Transparently calculated, clearly shown.",
            icon: "💸",
            dark: true,
        },
        {
            title: "Multi-currency",
            subtitle: "Invoice in USD, IDR, EUR, or any currency your client expects. Switch per invoice without losing your data.",
            icon: "🌍",
            dark: false,
        },
    ]

    return (
        <section className="max-w-[1200px] pt-[148px] px-[5%] pb-[100px]" style={{ margin: "0 auto" }} id="features">
            <div className="uppercase tracking-wide text-sm font-bold text-[var(--green)] pb-5">Features</div>
            <div className="text-3xl font-bold">Everything you need, <br></br>nothing you don't.</div>
            <div className="text-md max-w-[500px] pt-5">Invoicer strips invoice management down to its essentials — fast creation, clean exports, and partner memory that saves you time.</div>

            <div className="grid grid-cols-3 pt-10 gap-5 max-w-[1200px] m-auto">
                {features.map((e, index) => (
                    <FeatureCard key={index} title={e.title} subtitle={e.subtitle} icon={e.icon} dark={e.dark}></FeatureCard>

                ))}
            </div>
        </section>
    )
}