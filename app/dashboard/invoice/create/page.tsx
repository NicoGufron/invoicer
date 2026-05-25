import { createClient } from "@/lib/client";
import InvoiceLayout from "../invoice_layout";

export default async function CreateInvoice() {
    const supabase = await createClient();

    const { data: { user }} = await supabase.auth.getUser();

    return (
        <section className="p-6 min-h-auto flex flex-col">
            <InvoiceLayout user={user}></InvoiceLayout>
        </section>
    )
}