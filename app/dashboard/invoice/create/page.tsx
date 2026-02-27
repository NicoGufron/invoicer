import InvoiceEditor from "@/app/components/invoice_editor";
import InvoicePreview from "@/app/components/invoice_preview";

export default function CreateInvoice() {
    return (
        <section className="p-6 h-screen flex flex-col">
            {/* <p className="text-2xl font-bold pb-8">Create New Invoice</p> */}
            <div className="flex flex-row gap-5 flex-1 min-h-0">
                <div className="border flex-1 rounded-xl bg-white overflow-y-auto">
                    <InvoiceEditor></InvoiceEditor>
                </div>
                <div className="flex flex-col items-center border py-5 bg-white rounded-xl overflow-hidden">
                    <p className="mb-5 font-bold text-lg">Live Preview</p>
                    <InvoicePreview></InvoicePreview>
                </div>
            </div>
        </section>
    );
}