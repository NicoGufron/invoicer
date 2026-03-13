import InvoiceEditor from "@/app/components/invoice_editor";
import InvoicePreview from "@/app/components/invoice_preview";
import { createClient } from "@/lib/server";


export default async function EditInvoice({params} : {params : Promise<{id : string}>}) {

    const { id } = await params;

    const supabase = await createClient();

    const { data : { user }} = await supabase.auth.getUser();

    return(
        <section className="p-6 h-screen flex flex-col">
            <div className="flex flex-row gap-5 flex-1 min-h-0">
                <div className="border flex-1 rounded-xl bg-white overflow-y-auto">
                    <InvoiceEditor user={user} id={id}></InvoiceEditor>
                </div>
                <div className="flex flex-col items-center border py-5 bg-white rounded-xl overflow-y-auto">
                    <p className="mb-5 font-bold text-lg">Live Preview</p>
                    <InvoicePreview></InvoicePreview>
                </div>

            </div>
        </section>    
    );
}
