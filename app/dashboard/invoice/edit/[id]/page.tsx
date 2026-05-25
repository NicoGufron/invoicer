import { createClient } from "@/lib/server";
import InvoiceLayout from "../../invoice_layout";

export default async function EditInvoice({params} : {params : Promise<{id : string}>}) {

    const { id } = await params;

    const supabase = await createClient();

    const { data : { user }} = await supabase.auth.getUser();

    return(
        <section className="p-6 h-screen flex flex-col">
            <InvoiceLayout user={user} id={id}></InvoiceLayout>
        </section>    
    );
}
