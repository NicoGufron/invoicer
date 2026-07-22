import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { create } from "zustand";

export interface FeedbackData {
    email: "",
    name: "",
    issuesEncountered: "",
    valuableFeatures: "",
    improvementsWanted: "",
    recommendWebsite: "",
}

type FeedbackStore = {
    isLoading: boolean,

    submitFeedback: (payload: FeedbackData) => Promise<boolean>;
}

export const useFeedbackStore = create<FeedbackStore>()((set, get) => ({
    isLoading: false,

    submitFeedback: async (payload) => {
        const supabase = createClient();
        set({ isLoading: true });
        try {

            const payloadRev = {
                email: payload.email,
                name: payload.name,
                improvements_wanted : payload.improvementsWanted,
                issues_encountered: payload.issuesEncountered,
                valuable_features: payload.valuableFeatures,
                recommend_website: payload.recommendWebsite,
            }

            console.log(payloadRev);

            const { error } = await supabase.from('feedback').insert(payloadRev);

            if (error) {
                toast.error(error.message);
                return false;
            }

            return true;
        } catch (err: any) {
            toast.error(err.message);
            return false;
        } finally {
            set({ isLoading: false })
            return false;
        }
    }
}))