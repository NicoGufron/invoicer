import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { create } from "zustand";

export interface CompanyData {
    id: number
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

interface Country {
    id: number,
    country_name: string,
    short_name: string
}

const mappingCompanyData = (raw: any) : CompanyData => ({
    id: raw.id,
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
    isUpdating: boolean;
    company: CompanyData | null;
    countries: Country[];

    getCompany: () => void;
    getCountries: () => void;
    updateCompany: (patch: Partial<CompanyData>) => void;
    saveCompanyUpdate: (id: number, company: Partial<CompanyData>) => Promise<boolean>;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
    isLoading: false,
    isUpdating: false,
    company: null,
    countries: [],

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

    getCountries: async () => {
        const supabase = createClient();

        try {
            const { data, error } = await supabase.from('countries').select('*');

            if (error) throw error;
            set({countries: data});
        } catch (err: any) {
            toast.error(err.message);
            return;
        }
    },

    updateCompany: (patch) => {
        set((state) => ({
            company: state.company ? {
                ...state.company,
                ...patch,
            } : null,
        }))
    },
    
    saveCompanyUpdate: async (id, company) => {
        const supabase = createClient();
        set({isUpdating: true})

        try {
            // const { company } = useCompanyStore.getState();
            const { data : { user }} = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in");
                return false;
            }

            const payload = {
                company_name : company?.companyName,
                company_description: company?.companyDescription,
                company_type: company?.companyType,
                company_email : company?.companyEmail,
                company_phone_number: company?.companyPhoneNumber,
                country: company?.country,
                city: company?.city,
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase.from("company_profile").update(payload).eq("id", id).eq("user_id", user.id)
            
            if (error) throw error;

            toast.success("Company updated!");
            return true;
        } catch (err: any) {
            return false;
        } finally {
            set({isUpdating: false})
        }
    }
}))
