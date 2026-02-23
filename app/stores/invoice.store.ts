import { create } from "zustand";

export interface LineItem {
    id: string,
    name: string,
    description: string,
    quantity: number,
    rate: number,
}

export interface InvoiceData {
    companyName: string,
    companyAddress: string,
    companyEmail: string,
    clientName: string,
    clientAddress: string,
    clientEmail: string,
    invoiceNumber: string,
    issueDate: string,
    dueDate: string,
    logoUrl: string | null,
    items: LineItem[];
    taxRate: number;
    discountRate: number;
    notes: string,
    terms: string,
}

const uid = () => Math.random().toString(36).slice(2, 8);

const defaultInvoice: InvoiceData = {
    companyName: "Your Company",
    companyAddress: "123 Main St, City, State 00000",
    companyEmail: "hello@yourcompany.com",
    clientName: "Client Name",
    clientAddress: "456 Client Ave, City, State 00000",
    clientEmail: "client@example.com",
    invoiceNumber: "INV-001",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    logoUrl: null,
    items: [{ id: uid(), name: "Item", description: "Service or product", quantity: 1, rate: 100 }],
    taxRate: 10,
    discountRate: 0,
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days of invoice date.",
}

interface InvoiceStore {
    invoice: InvoiceData,

    updateInvoice: (patch: Partial<InvoiceData>) => void;

    addItem: () => void,
    removeItem: (id: string) => void;
    updateItem: (id: string, patch: Partial<LineItem>) => void;

    setLogo: (url: string | null) => void;

    resetInvoice: () => void;
}



export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoice: defaultInvoice,

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
                    ...state.invoice.items,
                    { id: uid(), name: "", description: "", quantity: 1, rate: 0 }
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
    }
}))