import InvoiceEditorV2 from "@/app/components/invoice_editor_v2";
import InvoicePreview from "@/app/components/invoice_preview";
import { createClient } from "@/lib/server";

export default async function CreateInvoice() {

    const supabase = await createClient()

    const { data: {user}} = await supabase.auth.getUser();

    return (
        <section className="p-6 h-screen flex flex-col">
            <div className="flex flex-row gap-5 flex-1">
                <div className="border flex-1 rounded-xl bg-white mb-5 shadow-xl">
                    <InvoiceEditorV2 user={user}></InvoiceEditorV2>
                </div>
                {/* <div className="flex flex-col items-center border py-5 bg-white rounded-xl overflow-hidden">
                    <p className="mb-5 font-bold text-lg">Live Preview</p>
                    <InvoicePreview></InvoicePreview>
                </div> */}
            </div>
        </section>
    );
}