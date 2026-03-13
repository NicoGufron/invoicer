import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { create } from "zustand";
export type PartnerType = 'client' | 'supplier' | 'both';

export type Partner = {
    id: number,
    created_at: string,
    updated_at: string,
    user_id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    type: PartnerType,
}


export type CreatePartnerPayload = Omit<Partner, 'id' | 'created_at' |'updated_at'>

type PartnerStore = {
    isLoading: boolean,
    isLoadingCreatePartner: boolean,
    partners: Partner[],
    createPartner: (payload: CreatePartnerPayload) => Promise<boolean>;
    getPartners: () => Promise<void>;
}

export const usePartnerStore = create<PartnerStore>()((set) => ({
    isLoading: false,
    isLoadingCreatePartner: false,
    partners: [],
    
    createPartner: async (payload) => {
        const supabase = createClient();
        set({isLoadingCreatePartner: true});

        try {
            const { error } = await supabase.from('partners').insert(payload);

            if (error) {
                toast.error(error.message);
                return false;
            }

            return true;
        } catch (err: any) {
            toast.error(err.message);
            return false;
        } finally {
            set({isLoadingCreatePartner: false});
        }
    },

    getPartners: async () => {
        const supabase = createClient();
        set ({isLoading: true});

        try {
            const { data, error} = await supabase.from('partners').select('*');

            if (error) {
                toast.error(error.message);
                return;
            }

            set({partners: data});
        } catch (err: any) {
            toast.error(err.message);
            return;
        } finally {
            set({isLoading: false})
        }
    }
}))