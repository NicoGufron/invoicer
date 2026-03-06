import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "./auth.store";
export interface LineItem {
    id: string,
    name: string,
    description: string,
    quantity: number,
    discountType: "percentage" | "nominal",
    discount: number,
    rate: number,
}

export interface InvoiceData {
    userId: string,
    invoiceNumber: string,
    issueDate: string,
    dueDate: string,
    companyName: string,
    companyAddress: string,
    companyEmail: string,
    companyNumber: string,
    partnerId: number,
    clientName?: string,
    clientAddress?: string,
    clientEmail?: string,
    clientNumber?: string,
    logoUrl: string | null,
    items: LineItem[];
    taxRate: number;
    totalAmount: number,
    discountRate: number;
    notes: string,
    terms: string,
    currency?: string,
}

const uid = () => crypto.randomUUID();
const year = new Date().getFullYear();

const defaultInvoice: InvoiceData = {
    userId: "",
    companyName: "Your Company",
    companyAddress: "123 Main St, City, State 00000",
    companyEmail: "hello@yourcompany.com",
    companyNumber: "",
    partnerId: 0,
    totalAmount: 0,
    clientName: "Client Name",
    clientAddress: "456 Client Ave, City, State 00000",
    clientEmail: "client@example.com",
    clientNumber: "",
    invoiceNumber: "INV/" + year + "/001",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    logoUrl: null,
    items: [{
        id: uid(),
        name: "Item",
        description: "Service or product",
        discountType: "percentage",
        quantity: 1,
        discount: 0,
        rate: 100
    }],
    taxRate: 0,
    discountRate: 0,
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days of invoice date.",
    currency: "USD",
}

export type CreateInvoicePayload = Omit<InvoiceData, 'id' | 'created_at' | 'updated_at'>
interface InvoiceStore {
    isLoading: boolean;
    invoice: InvoiceData,
    invoices: InvoiceData[],

    updateInvoice: (patch: Partial<InvoiceData>) => void;

    addItem: () => void,
    removeItem: (id: string) => void;
    updateItem: (id: string, patch: Partial<LineItem>) => void;

    setLogo: (url: string | null) => void;

    resetInvoice: () => void;

    saveDraftInvoice: () => Promise<boolean>;
    saveAndSendInvoice: (payload: InvoiceData, email: string) => void;
    deleteInvoice: (invoiceId: number) => Promise<boolean>;

    getInvoices: () => void;
}


export const useInvoiceStore = create<InvoiceStore>((set) => ({
    isLoading: false,
    invoice: defaultInvoice,
    invoices: [],

    updateInvoice: (patch) => {
        set((state) => ({
            invoice: {
                ...state.invoice,
                ...patch,
            },
        }))
    },

    addItem: () => {
        set((state) => ({
            invoice: {
                ...state.invoice,
                items: [
                    ...state.invoice.items, {
                        id: uid(),
                        name: "",
                        description: "",
                        quantity: 1,
                        discountType: "percentage",
                        discount: 0,
                        rate: 0
                    }
                ]
            }
        }))
    },

    removeItem: (id) => {
        set((state) => ({
            invoice: {
                ...state.invoice,
                items: state.invoice.items.filter((i) => i.id !== id)
            }
        }))
    },

    updateItem: (id, patch) => {
        set((state) => ({
            invoice: {
                ...state.invoice,
                items: state.invoice.items.map((i) => i.id === id ? { ...i, ...patch } : i)
            }
        }))
    },

    setLogo: (url) => {
        set((state) => ({
            invoice: {
                ...state.invoice,
                logoUrl: url
            }
        }))
    },

    resetInvoice: () => {
        set({ invoice: defaultInvoice })
    },

    saveDraftInvoice: async () => {
        const supabase = createClient();
        set({ isLoading: true });

        const { invoice } = useInvoiceStore.getState();
        const { data: { user } } = await supabase.auth.getUser();

        const payload = {
            user_id: user?.id,
            invoice_number: invoice.invoiceNumber,
            partner_id: invoice.partnerId,
            issue_date: invoice.issueDate,
            due_date: invoice.dueDate,
            items: invoice.items,
            notes: invoice.notes,
            terms: invoice.terms,
            status: "DRAFT",
            company_name: invoice.companyName,
            company_address: invoice.companyAddress,
            company_email: invoice.companyEmail,
            company_number: invoice.companyNumber,
            logo_url: invoice.logoUrl,
        }

        try {
            const { error } = await supabase.from("invoices").insert(payload);

            if (error) {
                throw error;
            }

            return true;
        } catch (err: any) {
            toast.error(err.message);
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    saveAndSendInvoice: (payload, email) => {

    },

    getInvoices: async () => {
        const supabase = createClient();
        set({ isLoading: true });

        const { data: { user }} = await supabase.auth.getUser();

        try {
            const { data, error } = await supabase.from('invoices')
                .select(`*,
                partners (
                    name,
                    email,
                    address,
                    phone
                )
            `).eq("user_id", user?.id).order("created_at", {ascending: false});

            if (error) {
                throw error;
            }

            set({ invoices: data });
        } catch (err: any) {
            toast.error(err.message);
            return;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteInvoice: async (invoiceId) => {
        const supabase = createClient();
        set({isLoading: true});

        try {
            const { error } = await supabase.from('invoices').delete().eq('id', invoiceId);

            if (error) throw error;

            // set((state) => ({
            //     invoices: state.invoices.filter((i) => i.)
            // }))

            return true;
        } catch (err: any) {
            toast.error(err.message);
            return false;
        }
    }
}))