import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { create } from "zustand";

export interface CompanyData {
    userId: string,
    companyName: string,
    companyDescription: string,
    companyType : string,
    companyEmail: string,
    companyPhoneNumber: string,
    companyAddress: string,
    country: string,
    city: string,
}

const mappingCompanyData = (raw: any) : CompanyData => ({
    companyName: raw.company_name,
    userId: raw.user_id,
    companyDescription: raw.company_description,
    companyType: raw.company_type,
    companyEmail: raw.company_email,
    companyAddress: raw.company_address,
    companyPhoneNumber: raw.company_phone_number,
    country: raw.country,
    city: raw.city
})

interface CompanyStore {
    isLoading: boolean;
    company: CompanyData | null;

    getCompany: () => void;
    updateCompany: () => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
    isLoading: false,
    company: null,

    getCompany: async () => {
        const supabase = createClient();
        set({isLoading: true})

        try {
            const { data : { user }} = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in");
                return false;
            }

            const { data, error } = await supabase.from('company_profile').select('*').eq("user_id", user?.id).single();
            
            if (error) throw error;

            set({ company:  mappingCompanyData(data)})

            
        } catch (err:any) {
            toast.error(err.message);
        } finally {
            set({isLoading: false});
        }
    },

    updateCompany: async () => {

    }
}))
