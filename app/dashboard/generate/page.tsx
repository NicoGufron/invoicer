import InvoiceEditor from "@/app/components/invoice_editor";
import InvoicePreview from "@/app/components/invoice_preview";

export default function Generate() {
    return (
        <section className="p-6">
            <div className="flex flex-row justify-between">
                <div className="border flex-1 mr-5 rounded-xl bg-white">

                    <InvoiceEditor></InvoiceEditor>
                </div>
                <div className="flex flex-col items-center border py-5 bg-white rounded-xl">
                    <p className="mb-5 font-bold text-lg">Live Preview</p>
                    <InvoicePreview></InvoicePreview>
                </div>
            </div>
        </section>
    );
}